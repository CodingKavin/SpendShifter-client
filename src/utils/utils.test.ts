import { describe, it, expect } from 'vitest';
import { sortArrOfObj } from './utils';

describe('sortArrOfObj()', () => {
  interface MockItem {
    id: number;
    name: string | null;
    amount: number;
    date: string | Date | null;
  }

  const mockData: MockItem[] = [
    { id: 1, name: 'Banana', amount: 50, date: '2024-05-01T12:00:00Z' },
    { id: 2, name: 'apple', amount: 2, date: new Date('2024-06-01T12:00:00Z') },
    { id: 3, name: null, amount: 10, date: null },
    { id: 4, name: '100 items', amount: 100, date: '2024-04-01T12:00:00Z' },
    { id: 5, name: '2 items', amount: 0, date: '2024-03-01T12:00:00Z' }, 
  ];

  it('sorts strings alphabetically and ignores case', () => {
    const result = sortArrOfObj(mockData, 'name', true);
    expect(result[0]!.name).toBe('2 items'); 
    expect(result[1]!.name).toBe('100 items');
    expect(result[2]!.name).toBe('apple');
  });

  it('sorts numbers correctly in ascending order', () => {
    const result = sortArrOfObj(mockData, 'amount', true);
    expect(result[0]!.amount).toBe(0);
    expect(result[1]!.amount).toBe(2);
  });

  it('sorts Date objects and date strings interchangeably', () => {
    const result = sortArrOfObj(mockData, 'date', false);
    expect(result[0]!.id).toBe(2);
    expect(result[1]!.id).toBe(1);
    expect(result[2]!.id).toBe(4);
  });

  it('always pushes null/undefined values to the bottom', () => {
    const asc = sortArrOfObj(mockData, 'name', true);
    expect(asc[4]!.name).toBeNull();
  });

  it('does NOT mutate the original array', () => {
    const originalRef = [...mockData]; 
    sortArrOfObj(mockData, 'amount', true);

    expect(mockData[0]!.id).toBe(1);
    expect(mockData[1]!.id).toBe(2);
  });
});