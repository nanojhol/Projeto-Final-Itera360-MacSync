using System.Text;
using System.Net.Http;
using System.Text.Json;
using System.Net.Http.Headers;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace Projeto360Final.Servicos
{
    public class GptService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<GptService> _logger;

        public GptService(HttpClient httpClient, IConfiguration config, ILogger<GptService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;
        }

        public async Task<string> GerarRespostaAsync(string pergunta)
        {
            var apiKey = _config["OpenAI:ApiKey"];
            var model = _config["OpenAI:Model"] ?? "gpt-3.5-turbo";
            var endpoint = "https://api.openai.com/v1/chat/completions";

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                _logger.LogError("Chave da API do OpenAI não encontrada nas configurações.");
                return "Erro: API Key ausente.";
            }

            var requestBody = new
            {
                model = model,
                messages = new[]
                {
                    new { role = "system", content = "Você é um especialista técnico em automação de máquinas." },
                    new { role = "user", content = pergunta }
                },
                temperature = 0.7
            };

            var requestJson = JsonSerializer.Serialize(requestBody);
            var content = new StringContent(requestJson, Encoding.UTF8, "application/json");

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

            try
            {
                var response = await _httpClient.PostAsync(endpoint, content);

                if (!response.IsSuccessStatusCode)
                {
                    var erro = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Erro ao chamar OpenAI: {Status} - {Detalhe}", response.StatusCode, erro);
                    return $"Erro ao processar sugestão com IA.";
                }

                using var stream = await response.Content.ReadAsStreamAsync();
                using var doc = await JsonDocument.ParseAsync(stream);

                var resposta = doc.RootElement
                                  .GetProperty("choices")[0]
                                  .GetProperty("message")
                                  .GetProperty("content")
                                  .GetString();

                return resposta ?? "Nenhuma resposta recebida da IA.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exceção ao comunicar com OpenAI");
                return "Erro interno ao gerar resposta com IA.";
            }
        }
    }
}
