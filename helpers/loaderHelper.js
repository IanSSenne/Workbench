class helper {
    constructor(count) {
        this.expect = count;
        this.loaded = new Set();
        this.onUpdate = () => { };
    }
    load(name) {
        const size = this.loaded.size;
        this.loaded.add(name);
        if (size != this.loaded.size) this.onUpdate(this.expect === this.loaded.size);
    }
}
export default new helper(2);