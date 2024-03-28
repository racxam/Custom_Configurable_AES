# python -u app.py

from flask import Flask, render_template, request, jsonify
import secrets
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend

app = Flask(__name__)

def generate_custom_nonce(block_size=16, custom_data=""):
    if not isinstance(block_size, int) or block_size <= 0:
        raise ValueError("Block size must be a positive integer.")
    random_part = secrets.token_bytes(max(0, block_size - len(custom_data)))
    nonce = random_part + custom_data.encode()
    return nonce

def encrypt_text(plaintext, key, nonce):
    cipher = Cipher(algorithms.AES(key), modes.CTR(nonce), backend=default_backend())
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(plaintext.encode()) + encryptor.finalize()
    return ciphertext

def decrypt_text(ciphertext, key, nonce):
    cipher = Cipher(algorithms.AES(key), modes.CTR(nonce), backend=default_backend())
    decryptor = cipher.decryptor()
    decrypted_text = decryptor.update(ciphertext) + decryptor.finalize()
    return decrypted_text.decode()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/encrypt', methods=['POST'])
def encrypt():
    plaintext = request.form['plaintext']
    key_size = int(request.form['key_size'])
    custom_nonce = request.form['custom_nonce']
    key = secrets.token_bytes(key_size)
    nonce = generate_custom_nonce(custom_data=custom_nonce)
    ciphertext = encrypt_text(plaintext, key, nonce)
    return jsonify({'ciphertext': ciphertext.hex(), 'key': key.hex(), 'nonce': nonce.hex()})

@app.route('/decrypt', methods=['POST'])
def decrypt():
    ciphertext = bytes.fromhex(request.form['ciphertext'])
    key = bytes.fromhex(request.form['key'])
    nonce = bytes.fromhex(request.form['nonce'])
    decrypted_text = decrypt_text(ciphertext, key, nonce)
    return jsonify({'decrypted_text': decrypted_text})

if __name__ == '__main__':
    app.run(debug=True)
