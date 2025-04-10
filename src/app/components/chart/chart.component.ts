import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartData } from '../../services/dashboard.service';

// Định nghĩa kiểu cho Chart.js để TypeScript không báo lỗi
declare global {
  interface Window {
    Chart: any;
  }
}

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  template: `<div class="chart-container">
    <canvas #chartCanvas></canvas>
  </div>`,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class ChartComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() chartData: ChartData | null = null;
  @Input() chartType: string = 'line';
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  private chart: any = null;
  private chartLoaded = false;

  constructor() { }

  ngOnInit(): void {
    this.loadChartLibrary();
  }

  ngAfterViewInit(): void {
    // Khi view đã được khởi tạo, chúng ta kiểm tra xem thư viện chart đã được tải chưa
    if (this.chartLoaded && this.chartData) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] && !changes['chartData'].firstChange && this.chart) {
      this.updateChart();
    }
  }

  private loadChartLibrary(): void {
    // Kiểm tra xem script đã được tải chưa
    const chartScriptExists = document.querySelector('script[src*="chart.js"]');
    
    if (!chartScriptExists) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        this.chartLoaded = true;
        if (this.chartData && this.chartCanvas) {
          this.createChart();
        }
      };
      document.head.appendChild(script);
    } else {
      this.chartLoaded = true;
    }
  }

  private createChart(): void {
    if (!this.chartData || !this.chartCanvas || !this.chartLoaded) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    
    if (window.Chart) {
      this.chart = new window.Chart(ctx, {
        type: this.chartType,
        data: {
          labels: this.chartData.labels,
          datasets: this.chartData.datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value: number): string {
                  return '$' + value.toLocaleString();
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function(context: any): string {
                  let label = context.dataset.label || '';
                  if (label) {
                    label += ': ';
                  }
                  if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD' 
                    }).format(context.parsed.y);
                  }
                  return label;
                }
              }
            }
          }
        }
      });
    }
  }

  private updateChart(): void {
    if (!this.chart || !this.chartData) return;
    
    this.chart.data.labels = this.chartData.labels;
    this.chart.data.datasets = this.chartData.datasets;
    this.chart.update();
  }
} 