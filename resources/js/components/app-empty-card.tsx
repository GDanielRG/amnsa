import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { cn } from '@/lib/utils';
import { type InertiaLinkProps, Link } from '@inertiajs/react';
import { type LucideIcon, PlusIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type EmptyCardBaseProps = {
    className?: string;
    icon: LucideIcon;
    title: string;
    subtitle: string;
};

type EmptyCardActionProps = {
    buttonLabel: string;
    href: NonNullable<InertiaLinkProps['href']>;
    buttonIcon?: LucideIcon;
    content?: never;
};

type EmptyCardContentProps = {
    content: ReactNode;
    buttonLabel?: never;
    href?: never;
    buttonIcon?: never;
};

type EmptyCardProps = EmptyCardBaseProps &
    (EmptyCardActionProps | EmptyCardContentProps);

export default function EmptyCard({
    className,
    icon: Icon,
    title,
    subtitle,
    buttonLabel,
    href,
    buttonIcon: ButtonIcon = PlusIcon,
    content,
}: EmptyCardProps) {
    return (
        <Empty className={cn('border', className)}>
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Icon />
                </EmptyMedia>
                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{subtitle}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="md:max-w-xl">
                {content ?? (
                    <Button
                        variant="outline"
                        size="sm"
                        render={<Link as="button" href={href} />}
                    >
                        <ButtonIcon />
                        {buttonLabel}
                    </Button>
                )}
            </EmptyContent>
        </Empty>
    );
}
