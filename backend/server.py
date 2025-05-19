from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# 📥 Old upload route (for Excel file upload)
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    print(f"✅ Received file: {file.filename}")
    return jsonify([{
        "course": "Unknown",
        "course_name": "Practical",
        "start_time": "09:00:00",
        "end_time": "11:00:00",
        "instructor": "John Doe",
        "remarks": "Bring lab coat",
        "weeks": "1,6,11-14"
    }])

# 📋 New cleaned upload route (for parsed JSON upload)
@app.route('/upload_cleaned', methods=['POST'])
def upload_cleaned():
    data = request.get_json()
    print("✅ Received cleaned JSON data:", data)
    return jsonify({
        "message": "Successfully received cleaned timetable",
        "received_events": data
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, port=5000)
