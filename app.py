from flask import Flask, render_template, request, redirect

app = Flask(__name__)

tasks = []
completed_tasks = []

@app.route("/")
def index():
    return render_template("index.html", tasks=tasks, completed_tasks=completed_tasks)

@app.route("/add", methods=["POST"])
def add_task():
    task = request.form.get("task")
    if task:
        tasks.append(task)
    return redirect("/")

@app.route("/delete/<int:task_id>")
def delete_task(task_id):
    tasks.pop(task_id)
    return redirect("/")

@app.route("/done/<int:task_id>")
def mark_done(task_id):
    task = tasks.pop(task_id)
    completed_tasks.append(task)
    return redirect("/")

if __name__ == "__main__":
    app.run(debug=True)
