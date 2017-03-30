import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';

import { SvgComponent } from '../svg/svg.component';

const NORMAL_SKIN_TONE = '#ffe9bf';
const NEXT_LEVEL_SKIN_TONE = '#ff6f00';

@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.sass']
})
export class FaceComponent implements OnChanges {
  @Input() private intensity: number;
  private selection;
  private color = d3
    .scaleLinear<string>()
    .domain([0, 1])
    .range([NORMAL_SKIN_TONE, NEXT_LEVEL_SKIN_TONE])
    .interpolate(d3.interpolateHcl);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('intensity') && this.selection) {
      this.selection
        .data([this.intensity])
        .transition()
        .duration(250)
        .attr('fill', d => this.color(d));
    }
  }

  private handleSVGLoaded(svg: SVGSVGElement): void {
    this.selection = d3.select(svg).select('#face');
  }
}