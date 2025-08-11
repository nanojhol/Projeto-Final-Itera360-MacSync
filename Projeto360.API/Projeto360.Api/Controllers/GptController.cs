// using Microsoft.AspNetCore.Mvc;
// using Projeto360Final.API.Models.Requisicao;
// using Projeto360Final.API.Models.Resposta;
// using Projeto360Final.Repositorio.Interfaces;
// using Projeto360Final.Dominio.Entidades;
// using Projeto360Final.Servicos;

// namespace Projeto360Final.API.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class GptController : ControllerBase
//     {
//         private readonly GptService _gptService;
//         private readonly ISugestaoIARepositorio _repositorio;

//         public GptController(GptService gptService, ISugestaoIARepositorio repositorio)
//         {
//             _gptService = gptService;
//             _repositorio = repositorio;
//         }

//         [HttpPost("avaliar-dispositivo")]
//         public async Task<ActionResult<GptAnaliseResposta>> AvaliarDispositivo([FromBody] GptAnaliseRequisicao req)
//         {
//             try
//             {
//                 var registros = await _repositorio.ObterRegistrosDeUtilizacaoPorMaquinaAsync(req.MaquinaId);
//                 var acionamentos = await _repositorio.ObterRegistrosDeAcionamentoPorMaquinaAsync(req.MaquinaId);

//                 int totalRegistros = registros.Count;
//                 int totalAcionamentos = acionamentos.Count;

//                 int disco = totalRegistros > 10 ? 256 : 128;
//                 int memoria = totalAcionamentos > 15 ? 8 : 4;

//                 string pergunta = $"Com base em {totalRegistros} registros de uso e {totalAcionamentos} acionamentos, " +
//                                   $"em um equipamento com {disco}GB de disco e {memoria}GB de memória, " +
//                                   $"qual sugestão técnica ou insight você daria para melhorar o desempenho desse dispositivo?";

//                 string respostaGPT = await _gptService.GerarRespostaAsync(pergunta);

//                 var sugestao = new SugestaoIA
//                 {
//                     MaquinaId = req.MaquinaId,
//                     EstabelecimentoId = req.EstabelecimentoId,
//                     Disco = disco,
//                     Memoria = memoria,
//                     TipoInsight = respostaGPT,
//                     DataGeracao = DateTime.Now
//                 };

//                 await _repositorio.AdicionarAsync(sugestao);

//                 var resposta = new GptAnaliseResposta
//                 {
//                     MaquinaId = sugestao.MaquinaId,
//                     EstabelecimentoId = sugestao.EstabelecimentoId,
//                     Disco = sugestao.Disco,
//                     Memoria = sugestao.Memoria,
//                     TipoInsight = sugestao.TipoInsight,
//                     DataGeracao = sugestao.DataGeracao
//                 };

//                 return Ok(resposta);
//             }
//             catch (Exception ex)
//             {
//                 return StatusCode(500, $"Erro ao gerar sugestão com IA: {ex.Message}");
//             }
//         }
//     }
// }
