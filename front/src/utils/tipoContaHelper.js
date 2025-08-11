const TipoContaMap = {
  1: "Master",
  2: "Coordenador",
  3: "Comum"
};

export function traduzirTipoConta(tipoContaId) {
  return TipoContaMap[tipoContaId] || "Desconhecido";
}
