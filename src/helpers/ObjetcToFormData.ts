const ObjetcToFormData = (data: Object) : FormData => {
    const recursive_call = (data: object, prefix: string = '', formDt: FormData = new FormData()) => {
        Object.entries(data).forEach(keyValue => {
            let k = keyValue[0];
            let v = keyValue[1];
            let keyName = Array.isArray(data) ? `ARRAY[${k}]` : k;
            let path = (prefix == '' ? '' : prefix + '@') + keyName;
            if(v instanceof File)
                formDt.append(path, v);
            else if (v instanceof Blob)
                formDt.append(path, v, k);
            else if (v instanceof Object)
                recursive_call(v, path, formDt);
            else
                formDt.append(path, v);
        });
        return formDt;
    }
    return recursive_call(data);
}

export default ObjetcToFormData;