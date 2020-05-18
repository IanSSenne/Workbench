export const ref = {
    exists(ref) {
        return new Promise((resolve) => {
            ref.orderByChild("ID").once("value", (a) => {
                resolve(a.exists())
            });
        });
    }
}