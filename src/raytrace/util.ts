export class Vec3 {
    static get zero() {
        return new Vec3(0, 0, 0);
    }

    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}

    get r() {
        return this.x;
    }
    get g() {
        return this.y;
    }
    get b() {
        return this.z;
    }

    get lengthSquared() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }
    get length() {
        return Math.sqrt(this.lengthSquared);
    }
    get unitVector() {
        return this.div(this.length);
    }

    get neg(): Vec3 {
        return new Vec3(-this.x, -this.y, -this.z);
    }
    public plus(input: Vec3 | number): Vec3 {
        if (typeof input === 'number') {
            return new Vec3(this.x + input, this.y + input, this.z + input);
        }
        return new Vec3(this.x + input.x, this.y + input.y, this.z + input.z);
    }
    public minus(input: Vec3 | number): Vec3 {
        if (typeof input === 'number') {
            return new Vec3(this.x - input, this.y - input, this.z - input);
        }
        return new Vec3(this.x - input.x, this.y - input.y, this.z - input.z);
    }
    public times(input: Vec3 | number): Vec3 {
        if (typeof input === 'number') {
            return new Vec3(this.x * input, this.y * input, this.z * input);
        }
        return new Vec3(this.x * input.x, this.y * input.y, this.z * input.z);
    }
    public div(input: Vec3 | number): Vec3 {
        if (typeof input === 'number') {
            return new Vec3(this.x / input, this.y / input, this.z / input);
        }
        return new Vec3(this.x / input.x, this.y / input.y, this.z / input.z);
    }

    public dot(input: Vec3): number {
        return this.x * input.x + this.y * input.y + this.z * input.z;
    }
    public cross(input: Vec3): Vec3 {
        return new Vec3(
            this.y * input.z - this.z * input.y,
            this.z * input.x - this.x * input.z,
            this.x * input.y - this.y * input.x,
        );
    }
}

export type Point3 = Vec3;
export type Color3 = Vec3;

export class Interval {
    static get empty() {
        return new Interval(+Infinity, -Infinity);
    }
    static get full() {
        return new Interval(-Infinity, +Infinity);
    }

    constructor(
        public min: number,
        public max: number,
    ) {}

    get size() {
        return this.max - this.min;
    }

    public contains(x: number) {
        return this.min <= x && x <= this.max;
    }

    public surrounds(x: number) {
        return this.min < x && x < this.max;
    }

    public clamp(x: number) {
        if (x < this.min) return this.min;
        if (x > this.max) return this.max;
        return x;
    }

    public random() {
        return Math.random() * this.size + this.min;
    }
}
