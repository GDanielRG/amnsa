import RowActionsMenu from '@/components/table/row-actions-menu';
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { TableCell } from '@/components/ui/table';
import type { InertiaLinkProps } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { EyeIcon, PencilIcon, TrashIcon } from 'lucide-react';

type LinkHref = InertiaLinkProps['href'];

type RowActionsCellProps = {
    dataTestPrefix: string;
    showHref?: LinkHref;
    editHref?: LinkHref;
    onDelete?: () => void;
};

export default function RowActionsCell({
    dataTestPrefix,
    showHref,
    editHref,
    onDelete,
}: RowActionsCellProps) {
    const hasViewOrEdit = showHref || editHref;

    return (
        <TableCell className="sticky right-0 z-10 w-14 min-w-14 text-right max-md:right-6">
            <RowActionsMenu triggerDataTest={`${dataTestPrefix}-actions`}>
                {showHref && (
                    <DropdownMenuItem
                        data-test={`${dataTestPrefix}-action-view`}
                        render={<Link href={showHref} prefetch />}
                    >
                        <EyeIcon />
                        Ver
                    </DropdownMenuItem>
                )}
                {editHref && (
                    <DropdownMenuItem
                        data-test={`${dataTestPrefix}-action-edit`}
                        render={<Link href={editHref} prefetch />}
                    >
                        <PencilIcon />
                        Editar
                    </DropdownMenuItem>
                )}
                {hasViewOrEdit && onDelete && <DropdownMenuSeparator />}
                {onDelete && (
                    <DropdownMenuItem
                        data-test={`${dataTestPrefix}-action-delete`}
                        variant="destructive"
                        onClick={onDelete}
                    >
                        <TrashIcon />
                        Eliminar
                    </DropdownMenuItem>
                )}
            </RowActionsMenu>
        </TableCell>
    );
}
