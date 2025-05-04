from flask import Flask, request, Response
import openai

app = Flask(__name__)
openai.api_key = "TU_VLOŽ_SVOJ_OPENAI_API_KEY"

@app.route("/voice", methods=['POST'])
def voice():
    user_input = request.form.get("SpeechResult", "")
    if not user_input:
        return Response("<Response><Say>Prepáčte, nerozumel som.</Say></Response>", mimetype='text/xml')

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Si AI operátor Vytepujto.sk. Odpovedaj len z knowledge_base."},
            {"role": "user", "content": user_input}
        ]
    )
    odpoved = response.choices[0].message.content

    xml = f"""<?xml version='1.0' encoding='UTF-8'?>
<Response>
    <Say>{odpoved}</Say>
</Response>"""
    return Response(xml, mimetype='text/xml')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
