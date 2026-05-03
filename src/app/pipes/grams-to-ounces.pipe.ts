import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'gramsToOunces', standalone: true })
export class GramsToOuncesPipe implements PipeTransform {
  transform(grams: number, unit: string = 'metric'): string {
    if (unit === 'imperial') {
      const oz = grams * 0.035274;
      return oz >= 16
        ? `${(oz / 16).toFixed(1)} lb`
        : `${oz.toFixed(1)} oz`;
    }
    return grams >= 1000
      ? `${(grams / 1000).toFixed(1)} kg`
      : `${grams} g`;
  }
}
