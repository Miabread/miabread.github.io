export class Vec3 extends Array<number> {
    static zero = new Vec3(0, 0, 0);

    constructor(x: number, y: number, z: number) {
        super(x, y, z);
    }

    get x() {
        return this[0];
    }
    get y() {
        return this[1];
    }
    get z() {
        return this[2];
    }

    get r() {
        return this[0];
    }
    get g() {
        return this[1];
    }
    get b() {
        return this[2];
    }

    get squared_length() {
        return this.x ** 2 + this.y ** 2 + this.z ** 2;
    }
    get length() {
        return Math.sqrt(this.squared_length);
    }
    get unitVector() {
        return this.div(this.length);
    }

    public neg(): Vec3 {
        return new Vec3(-this.x, -this.y, -this.z);
    }
    public plus(input: Vec3 | number): Vec3 {
        if (input instanceof Vec3) {
            return new Vec3(this.x + input.x, this.y + input.y, this.z + input.z);
        }
        return new Vec3(this.x + input, this.y + input, this.z + input);
    }
    public minus(input: Vec3 | number): Vec3 {
        if (input instanceof Vec3) {
            return new Vec3(this.x - input.x, this.y - input.y, this.z - input.z);
        }
        return new Vec3(this.x - input, this.y - input, this.z - input);
    }
    public times(input: Vec3 | number): Vec3 {
        if (input instanceof Vec3) {
            return new Vec3(this.x * input.x, this.y * input.y, this.z * input.z);
        }
        return new Vec3(this.x * input, this.y * input, this.z * input);
    }
    public div(input: Vec3 | number): Vec3 {
        if (input instanceof Vec3) {
            return new Vec3(this.x / input.x, this.y / input.y, this.z / input.z);
        }
        return new Vec3(this.x / input, this.y / input, this.z / input);
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

    public toFillStyle(): string {
        const ir = Math.trunc(255.99 * this.r);
        const ig = Math.trunc(255.99 * this.g);
        const ib = Math.trunc(255.99 * this.b);

        return `rgb(${ir},${ig},${ib})`;
    }
}

export type Point3 = Vec3;
export type Color3 = Vec3;

export class Ray {
    constructor(
        public origin: Point3,
        public direction: Vec3,
    ) {}

    public at(t: number): Point3 {
        return this.origin.plus(this.direction.times(t));
    }
}
