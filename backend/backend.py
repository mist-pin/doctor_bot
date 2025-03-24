from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///patients.db'
db = SQLAlchemy(app)
OLLAMA_API_URL = "http://localhost:11434/api/generate"

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.String(100), nullable=False)
    visit_date = db.Column(db.String(100), nullable=False)
    symptoms = db.Column(db.String(200), nullable=False)
    visit_count = db.Column(db.Integer, default=0)

with app.app_context():
    db.create_all()

@app.route('/api/user', methods=['POST'])
def submit_symptoms():
    data = request.json
    patient = Patient.query.filter_by(name=data['name']).first()
    if patient:
        patient.visit_count += 1
        patient.symptoms=data['symptoms']
        patient.visit_date=data['visitDate']
    else:
        patient = Patient(
            name=data['name'],
            dob=data['dob'],
            visit_date=data['visitDate'],
            symptoms=data['symptoms'],
        )
        db.session.add(patient)
    db.session.commit()
    return jsonify({'message': 'Patient data submitted successfully.'})

@app.route('/api/doc', methods=['GET'])
def load_all_questions():
    questions = Patient.query.with_entities(Patient.name, Patient.symptoms).all()
    question_list = [{'name': name, 'question': symptoms} for name, symptoms in questions]
    return jsonify(question_list)


@app.route('/api/doc/history', methods=['GET'])
def get_patient_history():
    patients = Patient.query.all()
    patient_list = [
        {'name': p.name, 'visit_count': p.visit_count}
        for p in patients
    ]
    return jsonify(patient_list)

@app.route('/api/doc/ask-ai', methods=['POST'])
def ask_ai():
    data = request.json
    question = data['question']
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    payload = {
        'model': 'mistral',
        'prompt': f"You are an AI Doctor specializing in medical diagnosis. Only provide answers related to diagnosing diseases based on symptoms. Do not answer general questions. \n\n{question}",
        'stream': False,
    }
    try:
        response = requests.post(OLLAMA_API_URL, json=payload)
        if response.status_code == 200:
            return jsonify({'question': question, 'answer': response.json().get('response', 'No response received')})
        else:
            return jsonify({'error': 'Ollama API error', 'status': response.status_code}), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({'error': f'Error communicating with Ollama: {str(e)}'}), 500

    # todo:// dummy. delete it# 
    # answer = f"Answer to: '{question}'"
    # return jsonify({'question': question, 'answer': answer})
    # todo:// dummy b end. delete it# 



if __name__ == '__main__':
    app.run(debug=True)
