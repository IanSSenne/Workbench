export default function ENUM(cls, string) {
    const a = Object.assign(Object.create(null), new cls);
    let offset = 0;
    Object.getOwnPropertyNames(a).forEach((v, i) => {
        if (string) {
            return a[v] = v;
        }
        if (i == 0) {
            if (typeof a[v] === "number")
                offset = a[v];
        }
        if (typeof a[v] === "number" && i + offset != a[v] && a[v] - i > offset)
            offset = a[v] - i;
        a[a[v] || i + offset] = v;
        a[v] = a[v] || i + offset;
    });
    return a;
}
