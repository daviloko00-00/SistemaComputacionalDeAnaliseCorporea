-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(250) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `senha_hash` VARCHAR(255) NOT NULL,
    `data_nascimento` DATE NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `email_verificado` BOOLEAN NOT NULL DEFAULT false,
    `ultimo_login` TIMESTAMP(0) NULL,
    `criado_em` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `perfil` (
    `idPerfil` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`idPerfil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_perfil` (
    `idUsuario` INTEGER NOT NULL,
    `idPerfil` INTEGER NOT NULL,

    PRIMARY KEY (`idUsuario`, `idPerfil`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dados_corporais` (
    `idDados` INTEGER NOT NULL AUTO_INCREMENT,
    `idUsuario` INTEGER NOT NULL,
    `peso_kg` DECIMAL(10, 2) NOT NULL,
    `altura_cm` DECIMAL(4, 2) NOT NULL,
    `genero` ENUM('Masculino', 'Feminino', 'Outro') NOT NULL,
    `idade` INTEGER NOT NULL,
    `nivel_atividade` ENUM('Sedentario', 'Leve', 'Moderado', 'Intenso', 'MuitoIntenso') NOT NULL,
    `data_registro` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `dados_corporais_idUsuario_key`(`idUsuario`),
    PRIMARY KEY (`idDados`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `calculos` (
    `idCalculo` INTEGER NOT NULL AUTO_INCREMENT,
    `idDados` INTEGER NOT NULL,
    `imc` DECIMAL(10, 2) NOT NULL,
    `tmb` DECIMAL(10, 2) NOT NULL,
    `ndc` DECIMAL(10, 2) NOT NULL,
    `data_calculo` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`idCalculo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `treinos` (
    `idTreino` INTEGER NOT NULL AUTO_INCREMENT,
    `idCalculo` INTEGER NOT NULL,
    `objetivo` ENUM('Hipertrofia', 'Emagrecimento', 'Resistencia', 'Condicionamento') NOT NULL,
    `nivel` ENUM('Iniciante', 'Intermediario', 'Avancado') NOT NULL,
    `data_criacao` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`idTreino`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercicios` (
    `idExercicio` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `caminho_video` VARCHAR(255) NULL,

    PRIMARY KEY (`idExercicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `treinos_exercicios` (
    `idTreino` INTEGER NOT NULL,
    `idExercicio` INTEGER NOT NULL,
    `series` INTEGER NOT NULL,
    `descanso_segundos` INTEGER NOT NULL,
    `repeticoes` INTEGER NOT NULL,
    `grupo_muscular` VARCHAR(250) NOT NULL,
    `tipo` ENUM('Forca', 'Cardio', 'Alongamento', 'Mobilidade') NOT NULL,

    PRIMARY KEY (`idTreino`, `idExercicio`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios_perfil` ADD CONSTRAINT `usuarios_perfil_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuarios_perfil` ADD CONSTRAINT `usuarios_perfil_idPerfil_fkey` FOREIGN KEY (`idPerfil`) REFERENCES `perfil`(`idPerfil`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dados_corporais` ADD CONSTRAINT `dados_corporais_idUsuario_fkey` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `calculos` ADD CONSTRAINT `calculos_idDados_fkey` FOREIGN KEY (`idDados`) REFERENCES `dados_corporais`(`idDados`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treinos` ADD CONSTRAINT `treinos_idCalculo_fkey` FOREIGN KEY (`idCalculo`) REFERENCES `calculos`(`idCalculo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treinos_exercicios` ADD CONSTRAINT `treinos_exercicios_idTreino_fkey` FOREIGN KEY (`idTreino`) REFERENCES `treinos`(`idTreino`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `treinos_exercicios` ADD CONSTRAINT `treinos_exercicios_idExercicio_fkey` FOREIGN KEY (`idExercicio`) REFERENCES `exercicios`(`idExercicio`) ON DELETE RESTRICT ON UPDATE CASCADE;
