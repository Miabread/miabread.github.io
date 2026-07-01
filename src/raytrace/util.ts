export class Vec3 {
    static get zero() {
        return new Vec3(0, 0, 0);
    }
    static get one() {
        return new Vec3(1, 1, 1);
    }

    constructor(
        public x: number,
        public y: number,
        public z: number,
    ) {}

    static random(interval: Interval): Vec3 {
        return new Vec3(interval.random(), interval.random(), interval.random());
    }
    static randomUnitVector(): Vec3 {
        while (true) {
            const p = Vec3.random(new Interval(-1, 1));
            if (1e-600 < p.lengthSquared && p.lengthSquared <= 1) {
                return p.div(Math.sqrt(p.lengthSquared));
            }
        }
    }
    static randomOnHemisphere(normal: Vec3): Vec3 {
        const onUnitSphere = this.randomUnitVector();
        return onUnitSphere.dot(normal) > 0.0 ? onUnitSphere : onUnitSphere.neg;
    }

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
    get nearZero() {
        const eps = 1e-8;
        return Math.abs(this.x) < eps && Math.abs(this.y) < eps && Math.abs(this.z) < eps;
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
    public map(func: (n: number) => number): Vec3 {
        return new Vec3(func(this.x), func(this.y), func(this.z));
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
    public reflect(input: Vec3): Vec3 {
        return this.minus(input.times(2 * this.dot(input)));
    }
    public refract(input: Vec3, etaIOverEtaT: number) {
        const cosTheta = Math.min(this.neg.dot(input), 1.0);
        const resultPerpendicular = this.plus(input.times(cosTheta)).times(etaIOverEtaT);
        const resultParallel = input.times(-Math.sqrt(Math.abs(1.0 - resultPerpendicular.lengthSquared)));
        return resultPerpendicular.plus(resultParallel);
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
    static get unit() {
        return new Interval(0, 1);
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
