from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta, datetime, timezone
import base64
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "welcome"
app.permanent_session_lifetime = timedelta(minutes=40)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"connect_args": {"check_same_thread": False}}
db = SQLAlchemy(app)

class Student(db.Model):
    __tablename__ = "usersTable"
    SI_NO = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(60))
    email = db.Column(db.String(100))
    password_hash = db.Column(db.String(200), nullable=False)
    profile_picture = db.Column(db.LargeBinary, nullable=True, default=None)

    def __init__(self, name, email, profile_picture=None):
        self.name = name
        self.email = email
        self.profile_picture = profile_picture.read() if profile_picture else None

    def save_hash_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_hash_password(self, password):
        return check_password_hash(self.password_hash, password)

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.String(60), nullable=False)
    title = db.Column(db.String(150), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    image = db.Column(db.LargeBinary, nullable=True)
    likes = db.Column(db.Integer, default=0)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/home")
def home():
    if "session-user" in session:
        posts = Post.query.order_by(Post.timestamp.desc()).all()
        for post in posts:
            if post.image:
                post.image = base64.b64encode(post.image).decode('utf-8')
        return render_template("home.html", posts=posts)
    else:
        flash("Please log in to access home.", "warning")
        return redirect(url_for("signin"))

@app.route("/signupRoute", methods=["GET", "POST"])
def signupRoute():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")
        profile_picture = request.files.get("profile_picture")
        profile_picture_data = profile_picture.read() if profile_picture else None

        existing_user = Student.query.filter_by(email=email).first()
        if existing_user:
            flash("Email already registered! Please log in.", "warning")
            return redirect(url_for("signin"))
        else:
            user = Student(name, email, profile_picture_data)
            user.save_hash_password(password)
            db.session.add(user)
            db.session.commit()
            flash("Signup successful! You can now log in.", "success")
            return redirect(url_for("signin"))
    return render_template("signup.html")

@app.route("/add_post", methods=["POST"])
def add_post():
    if "session-user" in session:
        title = request.form.get("title")
        content = request.form.get("content")
        author = session["user-name"]
        image = request.files.get("image")
        image_data = image.read() if image else None

        new_post = Post(author=author, title=title, content=content, image=image_data)
        db.session.add(new_post)
        db.session.commit()

        return redirect(url_for("home"))
    else:
        flash("Please log in to create a post.", "danger")
        return redirect(url_for("signin"))

@app.route("/update_profile_picture", methods=["POST"])
def update_profile_picture():
    if "session-user" not in session:
        flash("Please log in to change your profile picture.", "warning")
        return redirect(url_for("signin"))

    user_email = session["session-user"]
    user = Student.query.filter_by(email=user_email).first()

    if not user:
        flash("User not found!", "danger")
        return redirect(url_for("profile"))

    if "profile_picture" in request.files:
        image = request.files["profile_picture"]
        if image:
            user.profile_picture = image.read()
            db.session.commit()
            flash("Profile picture updated successfully!", "success")

    return redirect(url_for("profile"))

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
