import { Injectable } from '@nestjs/common';

@Injectable()
export class ScorecardService {
  calculateScore(productData: any, timeline: any[]): any {
    // 1. Carbon Score (40%)
    const carbonFootprint = parseFloat(productData.carbonFootprint || '0');
    let carbonScore = carbonFootprint > 0 ? Math.max(0, 100 - carbonFootprint * 2) : 30; // Lowered default

    // 2. Material Score (40%)
    const composition = productData.metadata?.composition || '';
    let materialScore = composition.includes('Recycled') || composition.includes('Organic') ? 90 : 40; // Lowered default

    // 3. Transparency Score (20%)
    // Based on timeline length and presence of audit logs
    const hasAuditLogs = timeline.some(e => e.type === 'AUDIT');
    let transparencyScore = (timeline.length * 10) + (hasAuditLogs ? 50 : 0);
    transparencyScore = Math.min(100, transparencyScore);

    // 4. Weighted Calculation
    const totalScore = (carbonScore * 0.4) + (materialScore * 0.4) + (transparencyScore * 0.2);
    const grade = this.getGrade(totalScore);

    return {
      total: Math.round(totalScore),
      grade,
      breakdown: {
        carbon: Math.round(carbonScore),
        material: Math.round(materialScore),
        transparency: Math.round(transparencyScore),
      },
    };
  }

  private getGrade(score: number): string {
    if (score >= 90) return 'A';
    if (score >= 75) return 'B';
    if (score >= 60) return 'C';
    if (score >= 40) return 'D';
    return 'E';
  }
}
