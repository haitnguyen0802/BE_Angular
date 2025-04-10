declare module 'chart.js' {
  export class Chart {
    constructor(
      context: CanvasRenderingContext2D,
      config: {
        type: string;
        data: {
          labels: string[];
          datasets: {
            label: string;
            data: number[];
            backgroundColor?: string;
            borderColor?: string;
            borderWidth?: number;
          }[];
        };
        options?: any;
      }
    );
    data: {
      labels: string[];
      datasets: any[];
    };
    update(): void;
  }

  export interface ChartTypeRegistry {
    line: any;
    bar: any;
    pie: any;
    doughnut: any;
    radar: any;
    polarArea: any;
    bubble: any;
    scatter: any;
  }

  export interface TooltipItem<TType extends keyof ChartTypeRegistry> {
    chart: Chart;
    label: string;
    dataIndex: number;
    dataset: {
      label?: string;
      data: number[];
    };
    parsed: {
      x: number;
      y: number;
    };
    formattedValue: string;
    raw: any;
  }
} 