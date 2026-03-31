import { Test, TestingModule } from '@nestjs/testing';
import { ScorecardService } from './scorecard.service';

describe('ScorecardService', () => {
  let service: ScorecardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScorecardService],
    }).compile();

    service = module.get<ScorecardService>(ScorecardService);
  });

  it('should calculate a high score for sustainable data', () => {
    const data = { carbonFootprint: '5.0', metadata: { composition: '100% Recycled Cotton' } };
    const timeline = [{ type: 'INGESTION' }, { type: 'AUDIT' }, { type: 'MINT' }];
    
    const result = service.calculateScore(data, timeline);

    expect(result.total).toBeGreaterThan(70);
    expect(['A', 'B']).toContain(result.grade);
    expect(result.breakdown.material).toBe(90);
  });

  it('should calculate a lower score when data is missing', () => {
    const data = {};
    const timeline: any[] = [];

    const result = service.calculateScore(data, timeline);

    expect(result.grade).toBe('E');
    expect(result.breakdown.transparency).toBe(0);
  });
});
