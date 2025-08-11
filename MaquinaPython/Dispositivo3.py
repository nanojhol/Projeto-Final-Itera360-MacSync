import time
import requests

# Configurações do dispositivo
MAC = "AA:BB:CC:DD:EE:33"
IP = "192.168.0.10"
URL = "http://localhost:5244/api/maquina"

falhas_envio = 0
status_dispositivo = 1  # 1 = Online, 2 = Erro, 0 = Offline

payload = {
    "MacAddress": MAC,
    "IP": IP,
    "Status": status_dispositivo
}

print(f"\r Enviado dados para a API: \n{payload}\n...")

def enviar_status():
    global falhas_envio, status_dispositivo

    # Define status baseado no número de falhas
    if falhas_envio < 5:
        status_dispositivo = 1  # Online
    elif falhas_envio < 7:
        status_dispositivo = 2  # Offline
    else:
        status_dispositivo = 3  # Errro


    try:
        # print(f"\n[PY] Enviando status ({status_dispositivo}) para a API...")
        r = requests.post(f"{URL}/status", json=payload)
        # print("[PY] Resposta crua da API:", r.status_code, r.text)
        r.raise_for_status()

        falhas_envio = 0  # resetar falhas
        response = r.json()
        acao = response.get("acao")

        if acao:
            print(f"[PY] Ação recebida da API: {acao}")
            executar_acao(acao)
        else:
            # print("[PY] Nenhuma ação recebida.")
            pass

    except Exception as e:
        falhas_envio += 1
        print(f"[PY] Erro ao enviar status (falha #{falhas_envio}):", e)

def executar_acao(acao):
    print(f"\n[PY] Executando ação: {acao}...")
    time.sleep(5)

    resposta = {
        "MacAddress": MAC,
        "Resposta": f"Ação '{acao}' executada com sucesso."
    }

    try:
        print("\n[PY] Enviando resposta de ação concluída...")
        r = requests.post(f"{URL}/resposta-acao", json=resposta)
        r.raise_for_status()
        print("[PY] Resposta enviada com sucesso.")
    except Exception as e:
        print("\n[PY] Erro ao enviar resposta:", e)

# Loop 
while True:
    enviar_status()
    time.sleep(10)

