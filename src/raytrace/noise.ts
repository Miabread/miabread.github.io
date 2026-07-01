import { Interval, type Point3 } from './util';

export abstract class Noise {
    public abstract noise(point: Point3): number;
}

export class Perlin extends Noise {
    private static pointCount = 256;

    private randomFloat: number[] = new Array(Perlin.pointCount);
    private permX: number[] = new Array(Perlin.pointCount);
    private permY: number[] = new Array(Perlin.pointCount);
    private permZ: number[] = new Array(Perlin.pointCount);

    constructor() {
        super();
        for (let i = 0; i < Perlin.pointCount; i++) {
            this.randomFloat[i] = Interval.unit.random();
        }

        Perlin.perlinGeneratePerm(this.permX);
        Perlin.perlinGeneratePerm(this.permY);
        Perlin.perlinGeneratePerm(this.permZ);
    }

    public noise(point: Point3): number {
        return point
            .map((n) => Math.floor(4 * n) & 255)
            .fold((x, y, z) => this.randomFloat[this.permX[x] ^ this.permY[y] ^ this.permZ[z]]);
    }

    private static perlinGeneratePerm(p: number[]) {
        for (let i = 0; i < this.pointCount; i++) {
            p[i] = i;
        }

        this.permute(p, this.pointCount);
    }

    private static permute(p: number[], n: number) {
        for (let i = n - 1; i > 0; i--) {
            const target = new Interval(0, i).randomInteger();

            const temp = p[i];
            p[i] = p[target];
            p[target] = temp;
        }
    }
}
