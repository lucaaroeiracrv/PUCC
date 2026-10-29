-- Execute pelo comando npm run preparar: ele aplica apenas as restrições ainda ausentes.
-- Requer MySQL 8.0.16 ou superior, que efetivamente verifica CHECK.
-- Os limites são de formato e armazenamento; não representam critérios de decisão clínica.
ALTER TABLE triagens ADD CONSTRAINT ck_triagens_saturacao
  CHECK (saturacao IS NULL OR saturacao BETWEEN 0 AND 100);
-- NULL preserva uma medida opcional não preenchida; números negativos são inválidos neste formato.
ALTER TABLE triagens ADD CONSTRAINT ck_triagens_temperatura
  CHECK (temperatura IS NULL OR temperatura BETWEEN 0 AND 99.99);
-- O texto obrigatório segue o limite aceito pelo formulário e pelo backend.
ALTER TABLE triagens ADD CONSTRAINT ck_triagens_queixa
  CHECK (CHAR_LENGTH(TRIM(queixa)) BETWEEN 1 AND 2000);
-- Uma consulta sem conteúdo não pode existir mesmo quando a escrita vem de um cliente SQL.
ALTER TABLE consultas ADD CONSTRAINT ck_consultas_registro
  CHECK (CHAR_LENGTH(TRIM(registro)) BETWEEN 1 AND 4000);
-- Os três campos abaixo são informações digitadas pelo profissional, sem sugestões automáticas.
ALTER TABLE medicacoes ADD CONSTRAINT ck_medicacoes_nome
  CHECK (CHAR_LENGTH(TRIM(medicacao)) BETWEEN 1 AND 120);
-- O tamanho acompanha a coluna e a validação da API.
ALTER TABLE medicacoes ADD CONSTRAINT ck_medicacoes_dose
  CHECK (CHAR_LENGTH(TRIM(dose)) BETWEEN 1 AND 80);
-- A via precisa conter texto, preservando a informação registrada no atendimento.
ALTER TABLE medicacoes ADD CONSTRAINT ck_medicacoes_via
  CHECK (CHAR_LENGTH(TRIM(via)) BETWEEN 1 AND 60);
