import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.route('/generate', methods=['POST'])
def generate_flashcards():
    data = request.get_json()
    prompt = data.get('prompt', '')
    if not prompt:
        return jsonify({'error': 'Prompt is required.'}), 400

    url = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + GEMINI_API_KEY
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": (
                            "Read the following notes or topic and generate a set of flashcards that best covers the material. "
                            "If the user specifies a number, generate that many. "
                            "Format:\nQ: <question>\nA: <answer>\nQ: <question>\nA: <answer>\n...\n"
                            "Notes or topic: " + prompt
                        )
                    }
                ]
            }
        ]
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, json=payload, headers=headers)
    gemini_data = response.json()
    print("Gemini API response:", gemini_data)
    candidates = gemini_data.get('candidates', [])
    if candidates and 'content' in candidates[0]:
        parts = candidates[0]['content'].get('parts', [])
        if parts and 'text' in parts[0]:
            text = parts[0]['text']
        else:
            text = ''
    else:
        text = ''

    flashcards = []
    lines = text.split('\n')
    for i in range(len(lines)):
        if lines[i].strip().startswith('Q:') and i+1 < len(lines) and lines[i+1].strip().startswith('A:'):
            flashcards.append({
                'question': lines[i][2:].strip(),
                'answer': lines[i+1][2:].strip()
            })

    if not flashcards:
        return jsonify({'error': 'No flashcards generated. See backend logs for Gemini API response.'}), 200

    return jsonify({'flashcards': flashcards})

@app.route('/')
def home():
    return "Flashcard backend is running!"

if __name__ == '__main__':
    app.run(port=5000)