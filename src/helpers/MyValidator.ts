import validator from 'validator';
import { cpf as cpfValidator, cnpj as cnpjValidator} from 'cpf-cnpj-validator';


interface ValidatorType {
    isValidEmail: (email: string) => boolean;
    isValidCpf: (cpf: string) => boolean;
    isValidCnpj: (cnpj: string) => boolean;
}

const MyValidator: ValidatorType = {
    isValidEmail: (email: string): boolean =>{
        return validator.isEmail(email);
    },
    isValidCpf: (cpf: string): boolean =>{
        return cpfValidator.isValid(cpf);
    },
    isValidCnpj: (cnpj: string): boolean =>{
        return cnpjValidator.isValid(cnpj);
    }
};


export default MyValidator;