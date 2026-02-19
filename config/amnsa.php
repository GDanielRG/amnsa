<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | The timezone used for date comparisons and display formatting.
    | This ensures dates flip at midnight in the business's local timezone.
    |
    */

    'timezone' => env('AMNSA_TIMEZONE', 'America/Monterrey'),

    /*
    |--------------------------------------------------------------------------
    | Roles and Permissions
    |--------------------------------------------------------------------------
    |
    | Hierarchical permission definitions. Each category maps to a group of
    | permissions using dot notation. Nested permissions (e.g. manage.verify_inspections)
    | are automatically created as children of their parent permission.
    |
    */

    'permissions' => [
        'personnel' => [
            ['manage' => 'Administrar usuarios, roles y permisos'],
        ],
        'tools' => [
            ['manage' => 'Administrar herramientas y modelos de herramientas'],
            ['manage.verify_inspections' => 'Verificar y editar inspecciones'],
        ],
        'companies' => [
            ['manage' => 'Administrar empresas'],
        ],
        'reports' => [
            ['view' => 'Ver reportes'],
            ['view.activity-report' => 'Ver reporte de actividades'],
            ['view.daily-real-time-report' => 'Ver reporte en tiempo real diario'],
        ],
        'machines' => [
            ['manage' => 'Administrar maquinas y proveedores de servicio'],
        ],
        'measuring_tools' => [
            ['manage' => 'Administrar herramientas de medicion'],
        ],
        'inventory' => [
            ['manage' => 'Administrar inventarios y proveedores de inventarios'],
            ['manage.alter_inventory_quantity' => 'Modificar cantidad de inventario'],
            ['manage.checkout_reports' => 'Administrar reportes de salida'],
            ['manage.purchase_orders' => 'Administrar ordenes de compra'],
        ],
    ],

    'user_and_role_permission' => 'personnel.manage',

    /*
    |--------------------------------------------------------------------------
    | Purchase Order Notifications
    |--------------------------------------------------------------------------
    |
    | Comma-separated email addresses to receive purchase order creation
    | notifications.
    |
    */

    'purchase_orders_notifications_to_addresses' => env('PURCHASE_ORDERS_NOTIFICATIONS_TO_ADDRESSES'),

    /*
    |--------------------------------------------------------------------------
    | Exports Storage Path
    |--------------------------------------------------------------------------
    |
    | Base path within the default filesystem disk where temporary export
    | files are stored before being emailed and deleted.
    |
    */

    'exports_storage_path' => env('EXPORTS_STORAGE_PATH', 'exports'),
];
