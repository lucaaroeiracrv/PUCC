-- Estrutura adicional de medicacoes; mantém as tabelas e os registros anteriores.
CREATE TABLE IF NOT EXISTS medicacoes (
  -- O identificador é gerado no banco e não depende do nome do paciente.
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  -- O relacionamento é feito com o atendimento, preservando visitas diferentes do mesmo paciente.
  atendimento_id BIGINT UNSIGNED NOT NULL ,
  -- O backend preenche o profissional usando a sessão autenticada.
  enfermeiro_id BIGINT UNSIGNED NOT NULL,
  -- Campos informados na tela; limites e obrigatoriedade são conferidos no backend.
  medicacao VARCHAR(120) NOT NULL,
  dose VARCHAR(80) NOT NULL,
  via VARCHAR(60) NOT NULL,
  observacoes TEXT NULL,
  -- A chave evita repetir a mesma tentativa de envio, inclusive após falha de rede.
  chave_registro CHAR(36) NOT NULL UNIQUE,
  -- O banco registra o instante da operação, sem exigir digitação do profissional.
  registrado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_medicacoes_atendimento FOREIGN KEY (atendimento_id) REFERENCES atendimentos(id),
  CONSTRAINT fk_medicacoes_usuario FOREIGN KEY (enfermeiro_id) REFERENCES usuarios(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
