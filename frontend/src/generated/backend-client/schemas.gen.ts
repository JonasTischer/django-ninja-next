// This file is auto-generated by @hey-api/openapi-ts

export const TokenResponseSchemaSchema = {
    properties: {
        detail: {
            title: 'Detail',
            type: 'string'
        },
        access: {
            title: 'Access',
            type: 'string'
        }
    },
    required: ['detail', 'access'],
    title: 'TokenResponseSchema',
    type: 'object'
} as const;

export const MyTokenObtainPairSchemaSchema = {
    properties: {
        password: {
            maxLength: 128,
            title: 'Password',
            type: 'string'
        },
        email: {
            maxLength: 255,
            title: 'Email',
            type: 'string'
        }
    },
    required: ['password', 'email'],
    title: 'MyTokenObtainPairSchema',
    type: 'object'
} as const;

export const UserSchemaSchema = {
    properties: {
        first_name: {
            title: 'First Name',
            type: 'string'
        },
        last_name: {
            title: 'Last Name',
            type: 'string'
        },
        email: {
            title: 'Email',
            type: 'string'
        }
    },
    required: ['first_name', 'last_name', 'email'],
    title: 'UserSchema',
    type: 'object'
} as const;

export const UserCreateSchemaSchema = {
    properties: {
        email: {
            title: 'Email',
            type: 'string'
        },
        password: {
            title: 'Password',
            type: 'string'
        },
        re_password: {
            title: 'Re Password',
            type: 'string'
        },
        first_name: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'First Name'
        },
        last_name: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Last Name'
        }
    },
    required: ['email', 'password', 're_password', 'first_name', 'last_name'],
    title: 'UserCreateSchema',
    type: 'object'
} as const;

export const SocialAuthSchemaSchema = {
    description: 'Schema for social authentication',
    properties: {
        credential: {
            title: 'Credential',
            type: 'string'
        },
        provider: {
            default: 'google',
            title: 'Provider',
            type: 'string'
        }
    },
    required: ['credential'],
    title: 'SocialAuthSchema',
    type: 'object'
} as const;

export const TokenObtainPairOutputSchemaSchema = {
    properties: {
        email: {
            maxLength: 255,
            title: 'Email',
            type: 'string'
        },
        refresh: {
            title: 'Refresh',
            type: 'string'
        },
        access: {
            title: 'Access',
            type: 'string'
        }
    },
    required: ['email', 'refresh', 'access'],
    title: 'TokenObtainPairOutputSchema',
    type: 'object'
} as const;

export const TokenObtainPairInputSchemaSchema = {
    properties: {
        password: {
            maxLength: 128,
            title: 'Password',
            type: 'string'
        },
        email: {
            maxLength: 255,
            title: 'Email',
            type: 'string'
        }
    },
    required: ['password', 'email'],
    title: 'TokenObtainPairInputSchema',
    type: 'object'
} as const;

export const TokenRefreshOutputSchemaSchema = {
    properties: {
        refresh: {
            title: 'Refresh',
            type: 'string'
        },
        access: {
            anyOf: [
                {
                    type: 'string'
                },
                {
                    type: 'null'
                }
            ],
            title: 'Access'
        }
    },
    required: ['refresh', 'access'],
    title: 'TokenRefreshOutputSchema',
    type: 'object'
} as const;

export const TokenRefreshInputSchemaSchema = {
    properties: {
        refresh: {
            title: 'Refresh',
            type: 'string'
        }
    },
    required: ['refresh'],
    title: 'TokenRefreshInputSchema',
    type: 'object'
} as const;

export const SchemaSchema = {
    properties: {},
    title: 'Schema',
    type: 'object'
} as const;

export const TokenVerifyInputSchemaSchema = {
    properties: {
        token: {
            title: 'Token',
            type: 'string'
        }
    },
    required: ['token'],
    title: 'TokenVerifyInputSchema',
    type: 'object'
} as const;