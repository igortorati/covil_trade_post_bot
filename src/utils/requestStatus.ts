export enum TradeRequestStatus {
  PENDING = 1,
  APPROVED = 2,
  REJECTED = 3,
  OUT_OF_STOCK = 4,
}

export const TradeRequestStatusNamePt: Record<TradeRequestStatus, string> = {
  [TradeRequestStatus.PENDING]: "Pendente",
  [TradeRequestStatus.APPROVED]: "Aprovado",
  [TradeRequestStatus.REJECTED]: "Rejeitado",
  [TradeRequestStatus.OUT_OF_STOCK]: "Fora de Estoque",
};