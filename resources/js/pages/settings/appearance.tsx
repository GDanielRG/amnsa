import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

export default function Appearance() {
    return (
        <AppLayout title="Configuración de apariencia">
            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Configuración de apariencia"
                        description="Actualiza la apariencia de tu cuenta"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
