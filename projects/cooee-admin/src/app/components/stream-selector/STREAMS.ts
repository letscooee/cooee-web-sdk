import {Stream} from '../../models/organization/stream.enum';

export interface StreamData {
    value: Stream;
    label: string;
}

export const STREAMS: StreamData[] = [
    {
        value: Stream.CIVIL_ENGINEERING,
        label: 'Civil Engineering'
    },
    {
        value: Stream.MECHANICAL_ENGINEERING,
        label: 'Mechanical Engineering'
    },
    {
        value: Stream.BBA,
        label: 'BBA'
    },
    {
        value: Stream.AGRICULTURE,
        label: 'Agriculture'
    },
    {
        value: Stream.ENVIRONMENTAL_SCIENCE,
        label: 'Environmental Science'
    },
    {
        value: Stream.COMPUTER_ENGINEERING,
        label: 'Computer Engineering'
    },
    {
        value: Stream.ELECTRICAL_ENGINEERING,
        label: 'Electrical Engineering'
    },
    {
        value: Stream.ELECTRONICS_ENGINEERING,
        label: 'Electronics Engineering'
    },
    {
        value: Stream.INFORMATION_TECHNOLOGY,
        label: 'Information Technology '
    },
    {
        value: Stream.PHYSICAL_SCIENCES,
        label: 'Physical Sciences'
    },
    {
        value: Stream.ECONOMICS,
        label: 'Economics'
    },
    {
        value: Stream.HISTORY,
        label: 'History'
    },
    {
        value: Stream.POLITICAL_SCIENCE,
        label: 'Political Science'
    },
    {
        value: Stream.PHILOSOPHY,
        label: 'Philosophy'
    },
    {
        value: Stream.PSYCHOLOGY,
        label: 'Psychology'
    },
    {
        value: Stream.SOCIOLOGY_AND_COMMERCE,
        label: 'Sociology and Commerce'
    },
    {
        value: Stream.OTHER,
        label: 'Others'
    }
];
