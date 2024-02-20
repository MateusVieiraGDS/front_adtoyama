import ReactInputMask from "react-input-mask";

export default function InputMaskCPF(params) {
    return ( 
        <ReactInputMask 
            mask="999.999.999-99" 
            value={params.row.cpf} 
            readOnly
            {...params}
        /> 
    );
}