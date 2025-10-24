from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)
load_dotenv()

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY must be set in the .env file")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

@app.route('/chat', methods=['POST'])
def chat():
    common_content = "Just provide smart, shortish answers to their queries. Our site is a platform for investors and startups. Investors can browse loan applications from SMEs (small and medium-sized enterprises) looking for funding. They can view detailed loan information, bid to fund startups, and track the progress of their investments. The site also provides personalized investor preferences and a dashboard to manage bids and investments. Investors can fund startups, view transaction statuses, and interact with a chatbot for assistance. The platform is integrated with blockchain for transparent transactions. Do not reply to this."

    referer = request.headers.get('Referer')

    if referer:
        if 'smedashboard' in referer:
            system_content = "You are Shark, a knowledgeable assistant for SMEs."  
        elif 'investor' in referer:
            system_content = "You are Dolphin, a knowledgeable assistant for investors."
        else:
            system_content = "You are a general assistant."
    else:
        system_content = "You are a general assistant."  

    full_system_content = system_content + " " + common_content

    user_input = request.json.get('message')
    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    try:
        # Create the prompt for Gemini
        prompt = f"{full_system_content}\n\nUser: {user_input}"
        
        # Generate response using Gemini
        response = model.generate_content(prompt)
        bot_reply = response.text if response.text else "I'm sorry, I couldn't process that. Please try again."
        
        return jsonify({"response": bot_reply}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
