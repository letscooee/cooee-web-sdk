import {AbstractBaseComponent} from './base-component';
import {PageEvent} from '@angular/material/paginator';
import {FormGroup} from '@angular/forms';
import {Directive} from '@angular/core';

@Directive()
export abstract class ListPageComponent<D> extends AbstractBaseComponent {

    private readonly DEFAULT_MAX = 10;

    max: number;
    params: any;
    filtersGroup: FormGroup;
    totalCount: number;
    dataSource: Array<D>;

    protected constructor() {
        super();
        this.setPageSize(this.DEFAULT_MAX);
    }

    abstract async list();

    setPageSize(max: number) {
        this.max = max;
        this.params = {max: this.max};
    }

    paginationChanged(event: PageEvent) {
        this.setPageSize(event.pageSize);
        this.params.offset = event.pageIndex * this.max;
        this.list();
    }
}
