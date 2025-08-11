using System.Text;
using Newtonsoft.Json;
using Projeto360Final.Servicos.Models;




namespace Projeto360Final.Servicos
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

        public GeminiService(HttpClient httpClient, string apiKey)
        {
            _httpClient = httpClient;
            _apiKey = apiKey;
        }

        public async Task<AnaliseInfraResponse> AnalisarInfraestruturaAsync(AnaliseInfraRequest request)
        {
            var promptBuilder = new StringBuilder();
            promptBuilder.AppendLine("Você é um assistente de infraestrutura e gerenciamento de capacidade de máquinas inteligente.");
            promptBuilder.AppendLine("Seu papel é analisar o histórico de uso de máquinas e sugerir melhorias de hardware com base em desempenho, verifica sempre o uso de disco e memória, informar se precisa aumentar ou não, da feedbacks das utilização dos sistemas, analizar se tem pouco ou muito uso, se a quantidade de uso for grande, indica para adicionar uma nova máquina, a memoria e disco inicial sempre será de 1GB mais se estiver com mais de 5 ou 10 utilizaçõe vamos sujerir para trocar o plano e aumentar sempre para o dobro de GB, e pode dar insgths para utilização também.");
            promptBuilder.AppendLine("Dados recebidos:");
            promptBuilder.AppendLine($">>>: '{request.NomeMaquina}' '({request.TipoDispositivo})'");
            promptBuilder.AppendLine($"Disco Atual: {request.DiscoAtualGB} GB");
            promptBuilder.AppendLine($"Memória Atual: {request.MemoriaAtualGB} GB");

            if (request.HistoricoDeUso?.Any() == true)
            {
                promptBuilder.AppendLine("\nHISTÓRICO DE USO:");
                foreach (var item in request.HistoricoDeUso)
                    promptBuilder.AppendLine("- " + item);
            }

            if (request.FeedbacksUsuarios?.Any() == true)
            {
                promptBuilder.AppendLine("\nFEEDBACK:");
                foreach (var item in request.FeedbacksUsuarios)
                    promptBuilder.AppendLine("- " + item);
            }

            promptBuilder.AppendLine(@"
                                    Responda em JSON estruturado no seguinte formato:
                                    {
                                    ""recomendacaoGeral"": ""Texto curto de 3 a 5 linhas e a principal recomendacao"",
                                    ""aumentarMemoria"": true,
                                    ""aumentarDisco"": true,
                                    ""adicionarMaisAparelhos"": true,
                                    ""justificativas"": [""Motivo 1"", ""Motivo 2"", ""Motivo 3""],
                                    ""nivelPrioridade"": 10
                                    }");


            var respostaTexto = await EnviarPromptGemini(promptBuilder.ToString());
            var respostaLimpa = LimparJsonResponse(respostaTexto);
            return JsonConvert.DeserializeObject<AnaliseInfraResponse>(respostaLimpa);
        }



        public async Task<AnaliseInfraUsuarioResponse> AnalisarInfraestruturaParaUsuarioAsync(AnaliseInfraUsuarioRequest request)
        {
            var promptBuilder = new StringBuilder();
            promptBuilder.AppendLine("Você é um assistente digital que dá dicas personalizadas para o usuário com base no uso de máquinas.");
            promptBuilder.AppendLine("Seu papel é analisar como o usuário tem utilizado o sistema, oferecer dicas para melhorar sua experiência e sugerir promoções ou upgrades quando apropriado.");
            promptBuilder.AppendLine("Considere o uso de memória, disco e quantidade de interações. Fale de forma amigável e acessível.");

            promptBuilder.AppendLine($"Usuário: {request.NomeUsuario}");
            promptBuilder.AppendLine($"Quantidade total de usos: {request.TotalUsos}");
            promptBuilder.AppendLine($"Disco atual das máquinas utilizadas: {request.DiscoMedio} GB");
            promptBuilder.AppendLine($"Memória atual das máquinas utilizadas: {request.MemoriaMedia} GB");

            if (request.HistoricoDeUso?.Any() == true)
            {
                promptBuilder.AppendLine("\nHistórico de uso:");
                foreach (var item in request.HistoricoDeUso)
                    promptBuilder.AppendLine("- " + item);
            }

            promptBuilder.AppendLine(@"
                                    Agora gere uma sugestão em JSON com base no histórico do usuário, no seguinte formato:
                                    {
                                        ""mensagemPrincipal"": ""Sugestão amigável com 3 até 5 linhas de orientação personalizada para o usuário."",
                                        ""sugerirPlanoMaior"": true,
                                        ""sugerirNovaPromocao"": true,
                                        ""dicasPersonalizadas"": [""Dica 1"", ""Dica 2"", ""Dica 3""],
                                        ""nivelDeUso"": ""Leve | Moderado | Intenso""
                                    }");

            var respostaTexto = await EnviarPromptGemini(promptBuilder.ToString());
            var respostaLimpa = LimparJsonResponse(respostaTexto);
            return JsonConvert.DeserializeObject<AnaliseInfraUsuarioResponse>(respostaLimpa);
        }





        private async Task<string> EnviarPromptGemini(string prompt)
        {
            var url = $"{_baseUrl}?key={_apiKey}";

            var payload = new
            {
                contents = new[]
                {
                    new
                    {
                        role = "user",
                        parts = new[] { new { text = prompt } }
                    }
                }
            };

            var content = new StringContent(JsonConvert.SerializeObject(payload), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync(url, content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
                throw new Exception($"Erro na API do Gemini: {response.StatusCode} - {responseBody}");

            dynamic json = JsonConvert.DeserializeObject(responseBody);
            return json?.candidates?[0]?.content?.parts?[0]?.text ?? "";
        }

        private string LimparJsonResponse(string response)
        {
            if (string.IsNullOrWhiteSpace(response)) return "{}";
            response = response.Replace("```json", "").Replace("```", "").Trim();
            var start = response.IndexOf('{');
            var end = response.LastIndexOf('}');
            if (start >= 0 && end > start)
                return response.Substring(start, end - start + 1);
            return response;
        }
    }
}