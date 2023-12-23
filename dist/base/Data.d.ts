export declare enum Scenario {
    PY = "PY",
    AC = "AC",
    FC = "FC",
    PL = "PL"
}
export type DataPoint = {
    [key in Scenario]?: number | [number];
};
export type Data = ({
    key: string;
} & DataPoint)[];
export declare const stackValues: (metaDataPoints: any) => any[];
export declare const extractValues: (dataPoint: DataPoint) => {
    left: any[];
    right: any[];
    primary: any[];
};
