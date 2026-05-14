export class Usuario {
    #id;
    #nome;
    #email;
    #senha_hash;
    #data_nascimento;
    #ativo;
    #email_verificado;

    constructor(
        nome,
        email,
        senha_hash,
        data_nascimento,
        ativo = true,
        email_verificado = false,
        id = null
    ) {
        this.nome = nome;
        this.email = email;
        this.senha_hash = senha_hash;
        this.data_nascimento = data_nascimento;
        this.ativo = ativo;
        this.email_verificado = email_verificado;
        this.id = id;
    }

    // ==========================
    // GETTERS
    // ==========================
    get id() {
        return this.#id;
    }

    get nome() {
        return this.#nome;
    }

    get email() {
        return this.#email;
    }

    get senha_hash() {
        return this.#senha_hash;
    }

    get data_nascimento() {
        return this.#data_nascimento;
    }

    get ativo() {
        return this.#ativo;
    }

    get email_verificado() {
        return this.#email_verificado;
    }

    // ==========================
    // SETTERS
    // ==========================
    set nome(value) {
        this.#validarNome(value);
        this.#nome = value.trim();
    }

    set email(value) {
        this.#validarEmail(value);
        this.#email = value.trim().toLowerCase();
    }

    set senha_hash(value) {
        this.#validarSenhaHash(value);
        this.#senha_hash = value;
    }

    set data_nascimento(value) {
        this.#validarDataNascimento(value);
        this.#data_nascimento = new Date(value);
    }

    set ativo(value) {
        this.#validarAtivo(value);
        this.#ativo = value;
    }

    set email_verificado(value) {
        this.#validarEmailVerificado(value);
        this.#email_verificado = value;
    }

    set id(value) {
        if (value !== null && value !== undefined) {
            this.#validarId(value);
            this.#id = Number(value);
        } else {
            this.#id = null;
        }
    }

    // ==========================
    // VALIDAÇÕES
    // ==========================
    #validarNome(value) {
        if (!value || value.trim().length < 3 || value.trim().length > 60) {
            throw new Error("Nome deve ter entre 3 e 60 caracteres");
        }
    }

    #validarEmail(value) {
        if (!value || value.trim().length < 5 || value.trim().length > 120) {
            throw new Error("Email deve ter entre 5 e 120 caracteres");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) {
            throw new Error("Email inválido");
        }
    }

    #validarSenhaHash(value) {
        if (!value || typeof value !== "string") {
            throw new Error("Senha hash inválida");
        }

        if (value.length < 40 || value.length > 255) {
            throw new Error("Senha hash deve ter entre 40 e 255 caracteres");
        }
    }

    #validarDataNascimento(value) {
        if (!value) {
            throw new Error("Data de nascimento é obrigatória");
        }

        const data = new Date(value);

        if (isNaN(data.getTime())) {
            throw new Error("Data de nascimento inválida");
        }

        const hoje = new Date();
        if (data > hoje) {
            throw new Error("Data de nascimento não pode ser futura");
        }
    }

    #validarAtivo(value) {
        if (typeof value !== "boolean") {
            throw new Error("Ativo deve ser true ou false");
        }
    }

    #validarEmailVerificado(value) {
        if (typeof value !== "boolean") {
            throw new Error("Email_verificado deve ser true ou false");
        }
    }

    #validarId(value) {
        if (isNaN(value) || Number(value) <= 0) {
            throw new Error("ID inválido");
        }
    }

    // ==========================
    // FACTORY METHODS
    // ==========================
    static criar({
        nome,
        email,
        senha_hash,
        data_nascimento
    }) {
        if (!nome || !email || !senha_hash || !data_nascimento) {
            throw new Error("Dados obrigatórios faltando");
        }

        return new Usuario(
            nome,
            email,
            senha_hash,
            data_nascimento,
            true,   // ativo padrão
            false,  // email_verificado padrão
            null
        );
    }

    static editar({
        nome,
        email,
        senha_hash,
        data_nascimento,
        ativo,
        email_verificado
    }, id) {

        if (!id || isNaN(id)) {
            throw new Error("ID é obrigatório para edição");
        }

        if (!nome || !email || !data_nascimento) {
            throw new Error("Dados obrigatórios faltando para edição");
        }

        return new Usuario(
            nome,
            email,
            senha_hash,
            data_nascimento,
            ativo ?? true,
            email_verificado ?? false,
            id
        );
    }
}