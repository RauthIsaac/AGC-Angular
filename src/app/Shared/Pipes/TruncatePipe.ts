import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true // Remove this if using modules
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 200, suffix: string = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) {
      return value;
    }
    
    // Find the last space within the limit to avoid cutting words
    const truncated = value.substring(0, limit);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      return truncated.substring(0, lastSpaceIndex) + suffix;
    }
    
    return truncated + suffix;
  }
}