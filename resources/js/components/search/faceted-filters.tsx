import { resolveFilterOptionIcon } from '@/components/search/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { SearchFilter } from '@/types';
import { CheckIcon, FunnelPlusIcon, FunnelXIcon } from 'lucide-react';

interface FacetedFiltersProps {
    filters: SearchFilter[];
    filterValues: Record<string, string[]>;
    onFilterValuesChange: (nextValues: Record<string, string[]>) => void;
    className?: string;
}

export default function FacetedFilters({
    filters,
    filterValues,
    onFilterValuesChange,
    className,
}: FacetedFiltersProps) {
    function updateFilterValues(filterKey: string, values: string[]): void {
        onFilterValuesChange({
            ...filterValues,
            [filterKey]: values,
        });
    }

    return (
        <div
            className={cn(
                'flex flex-wrap items-center gap-3',
                className,
            )}
        >
            {filters.map((filter) => {
                const selectedValues = filterValues[filter.key] ?? [];
                const selectedOptions = filter.options.filter((option) =>
                    selectedValues.includes(option.value),
                );

                function toggleOption(optionValue: string): void {
                    const nextValues = selectedValues.includes(optionValue)
                        ? selectedValues.filter(
                            (value) => value !== optionValue,
                        )
                        : [...selectedValues, optionValue];

                    updateFilterValues(filter.key, nextValues);
                }

                function resetFilter(): void {
                    updateFilterValues(filter.key, []);
                }

                return (
                    <Popover key={filter.key}>
                        <PopoverTrigger
                            render={(props, state) => (
                                <Button
                                    {...props}
                                    variant={
                                        state.open ? 'secondary' : 'outline'
                                    }
                                    className={cn(
                                        'transition-colors',
                                        selectedValues.length === 0 &&
                                        'border-dashed',
                                        selectedValues.length > 0 &&
                                        'group-has-[[data-clear]:hover]/applied:border-destructive/50 group-has-[[data-clear]:hover]/applied:text-destructive',
                                    )}
                                >
                                    {selectedValues.length === 0 && (
                                        <FunnelPlusIcon />
                                    )}
                                    {filter.label}
                                    {selectedValues.length > 0 && (
                                        <>
                                            <Separator
                                                orientation="vertical"
                                                className="h-full w-px"
                                            />
                                            <Badge
                                                variant="secondary"
                                                className="transition-colors group-has-[[data-clear]:hover]/applied:bg-destructive/10 group-has-[[data-clear]:hover]/applied:text-destructive sm:hidden"
                                            >
                                                {selectedValues.length}
                                            </Badge>
                                            <div className="hidden gap-1 sm:flex">
                                                {selectedValues.length > 2 ? (
                                                    <Badge
                                                        variant="secondary"
                                                        className="rounded-sm px-1 font-normal transition-colors group-has-[[data-clear]:hover]/applied:bg-destructive/10 group-has-[[data-clear]:hover]/applied:text-destructive"
                                                    >
                                                        {selectedValues.length}{' '}
                                                        seleccionados
                                                    </Badge>
                                                ) : (
                                                    selectedOptions.map(
                                                        (option) => (
                                                            <Badge
                                                                variant="secondary"
                                                                key={
                                                                    option.value
                                                                }
                                                                className="rounded-sm px-1 font-normal transition-colors group-has-[[data-clear]:hover]/applied:bg-destructive/10 group-has-[[data-clear]:hover]/applied:text-destructive"
                                                            >
                                                                {option.label}
                                                            </Badge>
                                                        ),
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}
                                </Button>
                            )}
                        />
                        <PopoverContent className="w-fit p-0" align="start">
                            <Command>
                                <CommandInput placeholder={filter.label} />
                                <CommandList>
                                    <CommandEmpty>
                                        No se encontraron resultados.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {filter.options
                                            .filter((option) => option.value)
                                            .map((option) => {
                                                const isSelected =
                                                    selectedValues.includes(
                                                        option.value,
                                                    );
                                                const OptionIcon =
                                                    resolveFilterOptionIcon(
                                                        option.icon,
                                                    );

                                                return (
                                                    <CommandItem
                                                        key={option.value}
                                                        data-test={`filter-${filter.key}-option-${option.value || 'all'}`}
                                                        onSelect={() =>
                                                            toggleOption(
                                                                option.value,
                                                            )
                                                        }
                                                    >
                                                        <div
                                                            className={cn(
                                                                'flex size-4 items-center justify-center rounded-[4px] border',
                                                                isSelected
                                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                                    : 'border-input [&_svg]:invisible',
                                                            )}
                                                        >
                                                            <CheckIcon className="size-3.5" />
                                                        </div>
                                                        {OptionIcon && (
                                                            <OptionIcon className="size-4 text-muted-foreground" />
                                                        )}
                                                        <span>
                                                            {option.label}
                                                        </span>
                                                    </CommandItem>
                                                );
                                            })}
                                    </CommandGroup>
                                </CommandList>
                                {selectedValues.length > 0 && (
                                    <>
                                <CommandSeparator />

                                    <div className="p-1">
                                        <Button
                                            className="w-full hover:text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/30"
                                            variant="ghost"
                                            onClick={resetFilter}
                                            >
                                            <FunnelXIcon/>
                                            Limpiar filtro
                                        </Button>
                                    </div>
                                            </>
                                )}
                            </Command>
                        </PopoverContent>
                    </Popover>
                );
            })}
        </div>
    );
}
