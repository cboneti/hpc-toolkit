const MODULES_LIST = {
    "core": {
        "compute": [
            {
                "id": "gke-job-template",
                "name": "Gke Job Template",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "allocatable_cpu_per_node",
                        "required": false
                    },
                    {
                        "name": "allocatable_gpu_per_node",
                        "required": false
                    },
                    {
                        "name": "backoff_limit",
                        "required": false
                    },
                    {
                        "name": "command",
                        "required": false
                    },
                    {
                        "name": "completion_mode",
                        "required": false
                    },
                    {
                        "name": "ephemeral_volumes",
                        "required": false
                    },
                    {
                        "name": "has_gpu",
                        "required": false
                    },
                    {
                        "name": "image",
                        "required": false
                    },
                    {
                        "name": "k8s_service_account_name",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "machine_family",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": false
                    },
                    {
                        "name": "node_count",
                        "required": false
                    },
                    {
                        "name": "node_pool_names",
                        "required": false
                    },
                    {
                        "name": "node_selectors",
                        "required": false
                    },
                    {
                        "name": "persistent_volume_claims",
                        "required": false
                    },
                    {
                        "name": "random_name_sufix",
                        "required": false
                    },
                    {
                        "name": "requested_cpu_per_pod",
                        "required": false
                    },
                    {
                        "name": "requested_gpu_per_pod",
                        "required": false
                    },
                    {
                        "name": "restart_policy",
                        "required": false
                    },
                    {
                        "name": "security_context",
                        "required": false
                    },
                    {
                        "name": "tolerations",
                        "required": false
                    },
                    {
                        "name": "tpu_accelerator_type",
                        "required": false
                    },
                    {
                        "name": "tpu_chips_per_node",
                        "required": false
                    },
                    {
                        "name": "tpu_topology",
                        "required": false
                    }
                ],
                "outputs": [
                    "instructions"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "gke-node-pool",
                "name": "Gke Node Pool",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "additional_networks",
                        "required": false
                    },
                    {
                        "name": "cluster_id",
                        "required": true
                    },
                    {
                        "name": "compact_placement",
                        "required": false
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "enable_flex_start",
                        "required": false
                    },
                    {
                        "name": "enable_gcfs",
                        "required": false
                    },
                    {
                        "name": "enable_numa_aware_scheduling",
                        "required": false
                    },
                    {
                        "name": "enable_private_nodes",
                        "required": false
                    },
                    {
                        "name": "enable_queued_provisioning",
                        "required": false
                    },
                    {
                        "name": "enable_secure_boot",
                        "required": false
                    },
                    {
                        "name": "gke_version",
                        "required": true
                    },
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "host_maintenance_interval",
                        "required": false
                    },
                    {
                        "name": "image_type",
                        "required": false
                    },
                    {
                        "name": "initial_node_count",
                        "required": false
                    },
                    {
                        "name": "internal_ghpc_module_id",
                        "required": true
                    },
                    {
                        "name": "kubernetes_labels",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "local_ssd_count_ephemeral_storage",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "max_pods_per_node",
                        "required": false
                    },
                    {
                        "name": "max_run_duration",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": false
                    },
                    {
                        "name": "num_node_pools",
                        "required": false
                    },
                    {
                        "name": "num_slices",
                        "required": false
                    },
                    {
                        "name": "placement_policy",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "reservation_affinity",
                        "required": false
                    },
                    {
                        "name": "run_workload_script",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "spot",
                        "required": false
                    },
                    {
                        "name": "taints",
                        "required": false
                    },
                    {
                        "name": "timeout_create",
                        "required": false
                    },
                    {
                        "name": "timeout_update",
                        "required": false
                    },
                    {
                        "name": "total_max_nodes",
                        "required": false
                    },
                    {
                        "name": "total_min_nodes",
                        "required": false
                    },
                    {
                        "name": "upgrade_settings",
                        "required": false
                    },
                    {
                        "name": "zones",
                        "required": false
                    }
                ],
                "outputs": [
                    "allocatable_cpu_per_node",
                    "allocatable_gpu_per_node",
                    "cluster_id",
                    "guest_accelerator",
                    "has_gpu",
                    "instance_templates",
                    "instructions",
                    "machine_type",
                    "node_count_static",
                    "node_pool_names",
                    "static_gpu_count",
                    "tolerations",
                    "tpu_accelerator_type",
                    "tpu_chips_per_node",
                    "tpu_topology"
                ],
                "inject_module_id": "internal_ghpc_module_id",
                "has_to_be_used": false
            },
            {
                "id": "resource-policy",
                "name": "Resource Policy",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "group_placement_max_distance",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "workload_policy",
                        "required": false
                    }
                ],
                "outputs": [
                    "placement_policy"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "vm-instance",
                "name": "Vm Instance",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "add_deployment_name_before_prefix",
                        "required": false
                    },
                    {
                        "name": "additional_persistent_disks",
                        "required": false
                    },
                    {
                        "name": "allocate_ip",
                        "required": false
                    },
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "auto_delete_boot_disk",
                        "required": false
                    },
                    {
                        "name": "automatic_restart",
                        "required": false
                    },
                    {
                        "name": "bandwidth_tier",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "disable_public_ips",
                        "required": false
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "instance_count",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "local_ssd_count",
                        "required": false
                    },
                    {
                        "name": "local_ssd_interface",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "min_cpu_platform",
                        "required": false
                    },
                    {
                        "name": "name_prefix",
                        "required": false
                    },
                    {
                        "name": "network_interfaces",
                        "required": false
                    },
                    {
                        "name": "network_self_link",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "on_host_maintenance",
                        "required": false
                    },
                    {
                        "name": "placement_policy",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "provisioning_model",
                        "required": false
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "reservation_name",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "spot",
                        "required": false
                    },
                    {
                        "name": "startup_script",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    },
                    {
                        "name": "tags",
                        "required": false
                    },
                    {
                        "name": "threads_per_core",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "external_ip",
                    "instructions",
                    "internal_ip",
                    "name",
                    "self_link"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "file-system": [
            {
                "id": "filestore",
                "name": "Filestore",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "connect_mode",
                        "required": false
                    },
                    {
                        "name": "deletion_protection",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "description",
                        "required": false
                    },
                    {
                        "name": "filestore_share_name",
                        "required": false
                    },
                    {
                        "name": "filestore_tier",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "local_mount",
                        "required": false
                    },
                    {
                        "name": "mount_options",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": false
                    },
                    {
                        "name": "network_id",
                        "required": true
                    },
                    {
                        "name": "nfs_export_options",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "protocol",
                        "required": false
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "reserved_ip_range",
                        "required": false
                    },
                    {
                        "name": "size_gb",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "capacity_gib",
                    "filestore_id",
                    "install_nfs_client",
                    "install_nfs_client_runner",
                    "mount_runner",
                    "network_storage"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "gke-persistent-volume",
                "name": "Gke Persistent Volume",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "capacity_gib",
                        "required": true
                    },
                    {
                        "name": "cluster_id",
                        "required": true
                    },
                    {
                        "name": "filestore_id",
                        "required": false
                    },
                    {
                        "name": "gcs_bucket_name",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "lustre_id",
                        "required": false
                    },
                    {
                        "name": "namespace",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": true
                    },
                    {
                        "name": "pv_name",
                        "required": false
                    },
                    {
                        "name": "pvc_name",
                        "required": false
                    }
                ],
                "outputs": [
                    "persistent_volume_claims",
                    "pvc_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "gke-storage",
                "name": "Gke Storage",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "capacity_gb",
                        "required": true
                    },
                    {
                        "name": "cluster_id",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "mount_options",
                        "required": false
                    },
                    {
                        "name": "namespace",
                        "required": false
                    },
                    {
                        "name": "private_vpc_connection_peering",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "pv_mount_path",
                        "required": false
                    },
                    {
                        "name": "pvc_count",
                        "required": false
                    },
                    {
                        "name": "sc_reclaim_policy",
                        "required": true
                    },
                    {
                        "name": "sc_topology_zones",
                        "required": false
                    },
                    {
                        "name": "storage_type",
                        "required": false
                    }
                ],
                "outputs": [
                    "persistent_volume_claims"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "managed-lustre",
                "name": "Managed Lustre",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "description",
                        "required": false
                    },
                    {
                        "name": "gke_support_enabled",
                        "required": false
                    },
                    {
                        "name": "import_gcs_bucket_uri",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "local_mount",
                        "required": false
                    },
                    {
                        "name": "mount_options",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": true
                    },
                    {
                        "name": "network_id",
                        "required": true
                    },
                    {
                        "name": "network_self_link",
                        "required": true
                    },
                    {
                        "name": "per_unit_storage_throughput",
                        "required": false
                    },
                    {
                        "name": "private_vpc_connection_peering",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "remote_mount",
                        "required": true
                    },
                    {
                        "name": "size_gib",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "capacity_gib",
                    "install_managed_lustre_client",
                    "lustre_id",
                    "network_storage"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "parallelstore",
                "name": "Parallelstore",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "daos_agent_config",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "dfuse_environment",
                        "required": false
                    },
                    {
                        "name": "directory_stripe",
                        "required": false
                    },
                    {
                        "name": "file_stripe",
                        "required": false
                    },
                    {
                        "name": "import_destination_path",
                        "required": false
                    },
                    {
                        "name": "import_gcs_bucket_uri",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "local_mount",
                        "required": false
                    },
                    {
                        "name": "mount_options",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": false
                    },
                    {
                        "name": "network_id",
                        "required": true
                    },
                    {
                        "name": "private_vpc_connection_peering",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "size_gb",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "instructions",
                    "network_storage"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "pre-existing-network-storage",
                "name": "Pre Existing Network Storage",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "fs_type",
                        "required": false
                    },
                    {
                        "name": "local_mount",
                        "required": false
                    },
                    {
                        "name": "managed_lustre_options",
                        "required": false
                    },
                    {
                        "name": "mount_options",
                        "required": false
                    },
                    {
                        "name": "parallelstore_options",
                        "required": false
                    },
                    {
                        "name": "remote_mount",
                        "required": true
                    },
                    {
                        "name": "server_ip",
                        "required": false
                    }
                ],
                "outputs": [
                    "client_install_runner",
                    "mount_runner",
                    "network_storage"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "internal": [
            {
                "id": "gpu-definition",
                "name": "Gpu Definition",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": true
                    }
                ],
                "outputs": [
                    "guest_accelerator",
                    "machine_type_guest_accelerator"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "instance_validations",
                "name": "Instance_validations",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "disk_type",
                        "required": true
                    },
                    {
                        "name": "machine_type",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "network-attachment",
                "name": "Network Attachment",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "connection_preference",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "subnetwork_self_links",
                        "required": true
                    }
                ],
                "outputs": [
                    "self_link"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "tpu-definition",
                "name": "Tpu Definition",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "machine_type",
                        "required": true
                    },
                    {
                        "name": "placement_policy",
                        "required": true
                    }
                ],
                "outputs": [
                    "is_tpu",
                    "tpu_accelerator_type",
                    "tpu_chips_per_node",
                    "tpu_taint",
                    "tpu_topology"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "vpc_peering",
                "name": "Vpc_peering",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "export_custom_routes",
                        "required": false
                    },
                    {
                        "name": "import_custom_routes",
                        "required": false
                    },
                    {
                        "name": "import_subnet_routes_with_public_ip",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": true
                    },
                    {
                        "name": "network_self_link",
                        "required": true
                    },
                    {
                        "name": "peer_network_self_link",
                        "required": true
                    },
                    {
                        "name": "stack_type",
                        "required": false
                    }
                ],
                "outputs": [
                    "peering_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "management": [
            {
                "id": "kubectl-apply",
                "name": "Kubectl Apply",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "apply_manifests",
                        "required": false
                    },
                    {
                        "name": "cluster_id",
                        "required": true
                    },
                    {
                        "name": "gib",
                        "required": false
                    },
                    {
                        "name": "gke_cluster_exists",
                        "required": false
                    },
                    {
                        "name": "gpu_operator",
                        "required": false
                    },
                    {
                        "name": "jobset",
                        "required": false
                    },
                    {
                        "name": "kueue",
                        "required": false
                    },
                    {
                        "name": "nvidia_dra_driver",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "monitoring": [
            {
                "id": "dashboard",
                "name": "Dashboard",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "base_dashboard",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "title",
                        "required": false
                    },
                    {
                        "name": "widgets",
                        "required": false
                    }
                ],
                "outputs": [
                    "instructions"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "network": [
            {
                "id": "firewall-rules",
                "name": "Firewall Rules",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "egress_rules",
                        "required": false
                    },
                    {
                        "name": "ingress_rules",
                        "required": false
                    },
                    {
                        "name": "network_name",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "gpu-rdma-vpc",
                "name": "Gpu Rdma Vpc",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "delete_default_internet_gateway_routes",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "enable_internal_traffic",
                        "required": false
                    },
                    {
                        "name": "firewall_log_config",
                        "required": false
                    },
                    {
                        "name": "firewall_rules",
                        "required": false
                    },
                    {
                        "name": "mtu",
                        "required": false
                    },
                    {
                        "name": "network_description",
                        "required": false
                    },
                    {
                        "name": "network_name",
                        "required": false
                    },
                    {
                        "name": "network_profile",
                        "required": true
                    },
                    {
                        "name": "network_routing_mode",
                        "required": false
                    },
                    {
                        "name": "nic_type",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "shared_vpc_host",
                        "required": false
                    },
                    {
                        "name": "subnetworks_template",
                        "required": false
                    }
                ],
                "outputs": [
                    "network_id",
                    "network_name",
                    "network_self_link",
                    "subnetwork_interfaces",
                    "subnetwork_interfaces_gke",
                    "subnetwork_name_prefix",
                    "subnetworks"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "multivpc",
                "name": "Multivpc",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "allowed_ssh_ip_ranges",
                        "required": false
                    },
                    {
                        "name": "delete_default_internet_gateway_routes",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "enable_iap_rdp_ingress",
                        "required": false
                    },
                    {
                        "name": "enable_iap_ssh_ingress",
                        "required": false
                    },
                    {
                        "name": "enable_iap_winrm_ingress",
                        "required": false
                    },
                    {
                        "name": "enable_internal_traffic",
                        "required": false
                    },
                    {
                        "name": "extra_iap_ports",
                        "required": false
                    },
                    {
                        "name": "firewall_rules",
                        "required": false
                    },
                    {
                        "name": "global_ip_address_range",
                        "required": false
                    },
                    {
                        "name": "ips_per_nat",
                        "required": false
                    },
                    {
                        "name": "mtu",
                        "required": false
                    },
                    {
                        "name": "network_count",
                        "required": false
                    },
                    {
                        "name": "network_description",
                        "required": false
                    },
                    {
                        "name": "network_interface_defaults",
                        "required": false
                    },
                    {
                        "name": "network_name_prefix",
                        "required": false
                    },
                    {
                        "name": "network_profile",
                        "required": false
                    },
                    {
                        "name": "network_routing_mode",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "subnetwork_cidr_suffix",
                        "required": false
                    }
                ],
                "outputs": [
                    "additional_networks",
                    "network_ids",
                    "network_names",
                    "network_self_links",
                    "subnetwork_addresses",
                    "subnetwork_names",
                    "subnetwork_self_links"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "pre-existing-subnetwork",
                "name": "Pre Existing Subnetwork",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "project",
                        "required": false
                    },
                    {
                        "name": "region",
                        "required": false
                    },
                    {
                        "name": "subnetwork_name",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    }
                ],
                "outputs": [
                    "subnetwork",
                    "subnetwork_address",
                    "subnetwork_name",
                    "subnetwork_self_link"
                ],
                "inject_module_id": null,
                "has_to_be_used": true
            },
            {
                "id": "pre-existing-vpc",
                "name": "Pre Existing Vpc",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "network_name",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "subnetwork_name",
                        "required": false
                    }
                ],
                "outputs": [
                    "network_id",
                    "network_name",
                    "network_self_link",
                    "subnetwork",
                    "subnetwork_address",
                    "subnetwork_name",
                    "subnetwork_self_link"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "vpc",
                "name": "Vpc",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "additional_subnetworks",
                        "required": false
                    },
                    {
                        "name": "allowed_ssh_ip_ranges",
                        "required": false
                    },
                    {
                        "name": "default_primary_subnetwork_size",
                        "required": false
                    },
                    {
                        "name": "delete_default_internet_gateway_routes",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "enable_cloud_nat",
                        "required": false
                    },
                    {
                        "name": "enable_cloud_router",
                        "required": false
                    },
                    {
                        "name": "enable_iap_rdp_ingress",
                        "required": false
                    },
                    {
                        "name": "enable_iap_ssh_ingress",
                        "required": false
                    },
                    {
                        "name": "enable_iap_winrm_ingress",
                        "required": false
                    },
                    {
                        "name": "enable_internal_traffic",
                        "required": false
                    },
                    {
                        "name": "extra_iap_ports",
                        "required": false
                    },
                    {
                        "name": "firewall_log_config",
                        "required": false
                    },
                    {
                        "name": "firewall_rules",
                        "required": false
                    },
                    {
                        "name": "ips_per_nat",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "mtu",
                        "required": false
                    },
                    {
                        "name": "network_address_range",
                        "required": false
                    },
                    {
                        "name": "network_description",
                        "required": false
                    },
                    {
                        "name": "network_name",
                        "required": false
                    },
                    {
                        "name": "network_profile",
                        "required": false
                    },
                    {
                        "name": "network_routing_mode",
                        "required": false
                    },
                    {
                        "name": "primary_subnetwork",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "secondary_ranges",
                        "required": false
                    },
                    {
                        "name": "secondary_ranges_list",
                        "required": false
                    },
                    {
                        "name": "shared_vpc_host",
                        "required": false
                    },
                    {
                        "name": "subnetwork_name",
                        "required": false
                    },
                    {
                        "name": "subnetwork_size",
                        "required": false
                    },
                    {
                        "name": "subnetworks",
                        "required": false
                    }
                ],
                "outputs": [
                    "nat_ips",
                    "network_id",
                    "network_name",
                    "network_self_link",
                    "subnetwork",
                    "subnetwork_address",
                    "subnetwork_name",
                    "subnetwork_self_link",
                    "subnetworks"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "scheduler": [
            {
                "id": "batch-job-template",
                "name": "Batch Job Template",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "enable_public_ips",
                        "required": false
                    },
                    {
                        "name": "gcloud_version",
                        "required": false
                    },
                    {
                        "name": "image",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "instance_template",
                        "required": false
                    },
                    {
                        "name": "job_filename",
                        "required": false
                    },
                    {
                        "name": "job_id",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "log_policy",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "mpi_mode",
                        "required": false
                    },
                    {
                        "name": "native_batch_mounting",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "on_host_maintenance",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "runnable",
                        "required": false
                    },
                    {
                        "name": "runnables",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "startup_script",
                        "required": false
                    },
                    {
                        "name": "submit",
                        "required": false
                    },
                    {
                        "name": "subnetwork",
                        "required": false
                    },
                    {
                        "name": "task_count",
                        "required": false
                    },
                    {
                        "name": "task_count_per_node",
                        "required": false
                    }
                ],
                "outputs": [
                    "gcloud_version",
                    "instance_template",
                    "instructions",
                    "job_data",
                    "network_storage",
                    "startup_script"
                ],
                "inject_module_id": "job_id",
                "has_to_be_used": false
            },
            {
                "id": "batch-login-node",
                "name": "Batch Login Node",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "batch_job_directory",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "gcloud_version",
                        "required": false
                    },
                    {
                        "name": "instance_template",
                        "required": true
                    },
                    {
                        "name": "job_data",
                        "required": true
                    },
                    {
                        "name": "job_filename",
                        "required": false
                    },
                    {
                        "name": "job_id",
                        "required": false
                    },
                    {
                        "name": "job_template_contents",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "startup_script",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "instructions",
                    "login_node_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "gke-cluster",
                "name": "Gke Cluster",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "additional_networks",
                        "required": false
                    },
                    {
                        "name": "authenticator_security_group",
                        "required": false
                    },
                    {
                        "name": "autoscaling_profile",
                        "required": false
                    },
                    {
                        "name": "cloud_dns_config",
                        "required": false
                    },
                    {
                        "name": "cluster_availability_type",
                        "required": false
                    },
                    {
                        "name": "cluster_reference_type",
                        "required": false
                    },
                    {
                        "name": "configure_workload_identity_sa",
                        "required": false
                    },
                    {
                        "name": "default_max_pods_per_node",
                        "required": false
                    },
                    {
                        "name": "deletion_protection",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "enable_dataplane_v2",
                        "required": false
                    },
                    {
                        "name": "enable_dcgm_monitoring",
                        "required": false
                    },
                    {
                        "name": "enable_external_dns_endpoint",
                        "required": false
                    },
                    {
                        "name": "enable_filestore_csi",
                        "required": false
                    },
                    {
                        "name": "enable_gcsfuse_csi",
                        "required": false
                    },
                    {
                        "name": "enable_k8s_beta_apis",
                        "required": false
                    },
                    {
                        "name": "enable_managed_lustre_csi",
                        "required": false
                    },
                    {
                        "name": "enable_master_global_access",
                        "required": false
                    },
                    {
                        "name": "enable_multi_networking",
                        "required": false
                    },
                    {
                        "name": "enable_node_local_dns_cache",
                        "required": false
                    },
                    {
                        "name": "enable_parallelstore_csi",
                        "required": false
                    },
                    {
                        "name": "enable_persistent_disk_csi",
                        "required": false
                    },
                    {
                        "name": "enable_private_endpoint",
                        "required": false
                    },
                    {
                        "name": "enable_private_ipv6_google_access",
                        "required": false
                    },
                    {
                        "name": "enable_private_nodes",
                        "required": false
                    },
                    {
                        "name": "enable_ray_operator",
                        "required": false
                    },
                    {
                        "name": "gcp_public_cidrs_access_enabled",
                        "required": false
                    },
                    {
                        "name": "k8s_network_names",
                        "required": false
                    },
                    {
                        "name": "k8s_service_account_name",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "maintenance_exclusions",
                        "required": false
                    },
                    {
                        "name": "maintenance_start_time",
                        "required": false
                    },
                    {
                        "name": "master_authorized_networks",
                        "required": false
                    },
                    {
                        "name": "master_ipv4_cidr_block",
                        "required": false
                    },
                    {
                        "name": "min_master_version",
                        "required": false
                    },
                    {
                        "name": "name_suffix",
                        "required": false
                    },
                    {
                        "name": "network_id",
                        "required": true
                    },
                    {
                        "name": "networking_mode",
                        "required": false
                    },
                    {
                        "name": "pods_ip_range_name",
                        "required": false
                    },
                    {
                        "name": "prefix_with_deployment_name",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "release_channel",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "services_ip_range_name",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": true
                    },
                    {
                        "name": "system_node_pool_disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_disk_type",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_enable_secure_boot",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_enabled",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_image_type",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_kubernetes_labels",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_machine_type",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_name",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_node_count",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_taints",
                        "required": false
                    },
                    {
                        "name": "system_node_pool_zones",
                        "required": false
                    },
                    {
                        "name": "timeout_create",
                        "required": false
                    },
                    {
                        "name": "timeout_update",
                        "required": false
                    },
                    {
                        "name": "upgrade_settings",
                        "required": false
                    },
                    {
                        "name": "version_prefix",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": false
                    }
                ],
                "outputs": [
                    "cluster_id",
                    "gke_cluster_exists",
                    "gke_version",
                    "instructions",
                    "k8s_service_account_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "pre-existing-gke-cluster",
                "name": "Pre Existing Gke Cluster",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "additional_networks",
                        "required": false
                    },
                    {
                        "name": "cluster_name",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "rdma_subnetwork_name_prefix",
                        "required": false
                    },
                    {
                        "name": "region",
                        "required": true
                    }
                ],
                "outputs": [
                    "cluster_id",
                    "gke_cluster_exists",
                    "gke_version"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "scripts": [
            {
                "id": "startup-script",
                "name": "Startup Script",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "ansible_virtualenv_path",
                        "required": false
                    },
                    {
                        "name": "bucket_viewers",
                        "required": false
                    },
                    {
                        "name": "configure_ssh_host_patterns",
                        "required": false
                    },
                    {
                        "name": "debug_file",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "docker",
                        "required": false
                    },
                    {
                        "name": "enable_docker_world_writable",
                        "required": false
                    },
                    {
                        "name": "enable_gpu_network_wait_online",
                        "required": false
                    },
                    {
                        "name": "gcs_bucket_path",
                        "required": false
                    },
                    {
                        "name": "http_no_proxy",
                        "required": false
                    },
                    {
                        "name": "http_proxy",
                        "required": false
                    },
                    {
                        "name": "install_ansible",
                        "required": false
                    },
                    {
                        "name": "install_cloud_ops_agent",
                        "required": false
                    },
                    {
                        "name": "install_cloud_rdma_drivers",
                        "required": false
                    },
                    {
                        "name": "install_docker",
                        "required": false
                    },
                    {
                        "name": "install_stackdriver_agent",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "local_ssd_filesystem",
                        "required": false
                    },
                    {
                        "name": "managed_lustre",
                        "required": false
                    },
                    {
                        "name": "prepend_ansible_installer",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "runners",
                        "required": false
                    },
                    {
                        "name": "set_ofi_cloud_rdma_tunables",
                        "required": false
                    }
                ],
                "outputs": [
                    "compute_startup_script",
                    "controller_startup_script",
                    "startup_script"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ]
    },
    "community": {
        "compute": [
            {
                "id": "gke-nodeset",
                "name": "Gke Nodeset",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "cluster_id",
                        "required": true
                    },
                    {
                        "name": "filestore_id",
                        "required": true
                    },
                    {
                        "name": "image",
                        "required": true
                    },
                    {
                        "name": "instance_templates",
                        "required": true
                    },
                    {
                        "name": "network_storage",
                        "required": true
                    },
                    {
                        "name": "node_count_static",
                        "required": true
                    },
                    {
                        "name": "node_pool_names",
                        "required": true
                    },
                    {
                        "name": "nodeset_name",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "slurm_bucket",
                        "required": true
                    },
                    {
                        "name": "slurm_bucket_dir",
                        "required": true
                    },
                    {
                        "name": "slurm_cluster_name",
                        "required": true
                    },
                    {
                        "name": "slurm_controller_instance",
                        "required": true
                    },
                    {
                        "name": "slurm_namespace",
                        "required": false
                    },
                    {
                        "name": "subnetwork",
                        "required": true
                    }
                ],
                "outputs": [
                    "nodeset_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "gke-partition",
                "name": "Gke Partition",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "has_tpu",
                        "required": false
                    },
                    {
                        "name": "nodeset_name",
                        "required": false
                    },
                    {
                        "name": "partition_name",
                        "required": false
                    },
                    {
                        "name": "slurm_bucket",
                        "required": true
                    },
                    {
                        "name": "slurm_bucket_dir",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "htcondor-execute-point",
                "name": "Htcondor Execute Point",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "central_manager_ips",
                        "required": true
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "distribution_policy_target_shape",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "enable_shielded_vm",
                        "required": false
                    },
                    {
                        "name": "execute_point_runner",
                        "required": false
                    },
                    {
                        "name": "execute_point_service_account_email",
                        "required": true
                    },
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "htcondor_bucket_name",
                        "required": true
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "max_size",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "min_idle",
                        "required": false
                    },
                    {
                        "name": "name_prefix",
                        "required": true
                    },
                    {
                        "name": "network_self_link",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "shielded_instance_config",
                        "required": false
                    },
                    {
                        "name": "spot",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    },
                    {
                        "name": "target_size",
                        "required": false
                    },
                    {
                        "name": "update_policy",
                        "required": false
                    },
                    {
                        "name": "windows_startup_ps1",
                        "required": false
                    },
                    {
                        "name": "zones",
                        "required": false
                    }
                ],
                "outputs": [
                    "autoscaler_runner",
                    "mig_id"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "mig",
                "name": "Mig",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "base_instance_name",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "ghpc_module_id",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "name",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "target_size",
                        "required": false
                    },
                    {
                        "name": "versions",
                        "required": true
                    },
                    {
                        "name": "wait_for_instances",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "self_link"
                ],
                "inject_module_id": "ghpc_module_id",
                "has_to_be_used": false
            },
            {
                "id": "notebook",
                "name": "Notebook",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "gcs_bucket_path",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "machine_type",
                        "required": true
                    },
                    {
                        "name": "mount_runner",
                        "required": true
                    },
                    {
                        "name": "network_interfaces",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "schedmd-slurm-gcp-v6-nodeset",
                "name": "Schedmd Slurm Gcp V6 Nodeset",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "accelerator_topology",
                        "required": false
                    },
                    {
                        "name": "access_config",
                        "required": false
                    },
                    {
                        "name": "additional_disks",
                        "required": false
                    },
                    {
                        "name": "additional_networks",
                        "required": false
                    },
                    {
                        "name": "advanced_machine_features",
                        "required": false
                    },
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "bandwidth_tier",
                        "required": false
                    },
                    {
                        "name": "can_ip_forward",
                        "required": false
                    },
                    {
                        "name": "disable_public_ips",
                        "required": false
                    },
                    {
                        "name": "disk_auto_delete",
                        "required": false
                    },
                    {
                        "name": "disk_labels",
                        "required": false
                    },
                    {
                        "name": "disk_resource_manager_tags",
                        "required": false
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "dws_flex",
                        "required": false
                    },
                    {
                        "name": "enable_confidential_vm",
                        "required": false
                    },
                    {
                        "name": "enable_maintenance_reservation",
                        "required": false
                    },
                    {
                        "name": "enable_opportunistic_maintenance",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "enable_placement",
                        "required": false
                    },
                    {
                        "name": "enable_public_ips",
                        "required": false
                    },
                    {
                        "name": "enable_shielded_vm",
                        "required": false
                    },
                    {
                        "name": "enable_smt",
                        "required": false
                    },
                    {
                        "name": "enable_spot_vm",
                        "required": false
                    },
                    {
                        "name": "future_reservation",
                        "required": false
                    },
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "instance_image_custom",
                        "required": false
                    },
                    {
                        "name": "instance_properties",
                        "required": false
                    },
                    {
                        "name": "instance_template",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "maintenance_interval",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "min_cpu_platform",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": true
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "node_conf",
                        "required": false
                    },
                    {
                        "name": "node_count_dynamic_max",
                        "required": false
                    },
                    {
                        "name": "node_count_static",
                        "required": false
                    },
                    {
                        "name": "on_host_maintenance",
                        "required": false
                    },
                    {
                        "name": "placement_max_distance",
                        "required": false
                    },
                    {
                        "name": "preemptible",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "reservation_name",
                        "required": false
                    },
                    {
                        "name": "resource_manager_tags",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "shielded_instance_config",
                        "required": false
                    },
                    {
                        "name": "spot_instance_config",
                        "required": false
                    },
                    {
                        "name": "startup_script",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": true
                    },
                    {
                        "name": "tags",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    },
                    {
                        "name": "zone_target_shape",
                        "required": false
                    },
                    {
                        "name": "zones",
                        "required": false
                    }
                ],
                "outputs": [
                    "nodeset"
                ],
                "inject_module_id": "name",
                "has_to_be_used": true
            },
            {
                "id": "schedmd-slurm-gcp-v6-nodeset-dynamic",
                "name": "Schedmd Slurm Gcp V6 Nodeset Dynamic",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "access_config",
                        "required": false
                    },
                    {
                        "name": "additional_disks",
                        "required": false
                    },
                    {
                        "name": "additional_networks",
                        "required": false
                    },
                    {
                        "name": "advanced_machine_features",
                        "required": false
                    },
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "bandwidth_tier",
                        "required": false
                    },
                    {
                        "name": "can_ip_forward",
                        "required": false
                    },
                    {
                        "name": "disk_auto_delete",
                        "required": false
                    },
                    {
                        "name": "disk_labels",
                        "required": false
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "enable_confidential_vm",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "enable_public_ips",
                        "required": false
                    },
                    {
                        "name": "enable_shielded_vm",
                        "required": false
                    },
                    {
                        "name": "enable_smt",
                        "required": false
                    },
                    {
                        "name": "enable_spot_vm",
                        "required": false
                    },
                    {
                        "name": "feature",
                        "required": false
                    },
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "instance_image_custom",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "min_cpu_platform",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": true
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "on_host_maintenance",
                        "required": false
                    },
                    {
                        "name": "preemptible",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "shielded_instance_config",
                        "required": false
                    },
                    {
                        "name": "slurm_bucket_path",
                        "required": true
                    },
                    {
                        "name": "slurm_cluster_name",
                        "required": true
                    },
                    {
                        "name": "spot_instance_config",
                        "required": false
                    },
                    {
                        "name": "startup_script",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": true
                    },
                    {
                        "name": "tags",
                        "required": false
                    },
                    {
                        "name": "universe_domain",
                        "required": false
                    }
                ],
                "outputs": [
                    "instance_template_self_link",
                    "node_name_prefix",
                    "nodeset_dyn"
                ],
                "inject_module_id": "name",
                "has_to_be_used": false
            },
            {
                "id": "schedmd-slurm-gcp-v6-nodeset-tpu",
                "name": "Schedmd Slurm Gcp V6 Nodeset Tpu",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "accelerator_config",
                        "required": false
                    },
                    {
                        "name": "data_disks",
                        "required": false
                    },
                    {
                        "name": "disable_public_ips",
                        "required": false
                    },
                    {
                        "name": "docker_image",
                        "required": false
                    },
                    {
                        "name": "enable_public_ips",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": true
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "node_count_dynamic_max",
                        "required": false
                    },
                    {
                        "name": "node_count_static",
                        "required": false
                    },
                    {
                        "name": "node_type",
                        "required": false
                    },
                    {
                        "name": "preemptible",
                        "required": false
                    },
                    {
                        "name": "preserve_tpu",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "reserved",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": true
                    },
                    {
                        "name": "tf_version",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "nodeset_tpu"
                ],
                "inject_module_id": "name",
                "has_to_be_used": true
            },
            {
                "id": "schedmd-slurm-gcp-v6-partition",
                "name": "Schedmd Slurm Gcp V6 Partition",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "exclusive",
                        "required": false
                    },
                    {
                        "name": "is_default",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "nodeset",
                        "required": false
                    },
                    {
                        "name": "nodeset_dyn",
                        "required": false
                    },
                    {
                        "name": "nodeset_tpu",
                        "required": false
                    },
                    {
                        "name": "partition_conf",
                        "required": false
                    },
                    {
                        "name": "partition_name",
                        "required": true
                    },
                    {
                        "name": "resume_timeout",
                        "required": false
                    },
                    {
                        "name": "suspend_time",
                        "required": false
                    },
                    {
                        "name": "suspend_timeout",
                        "required": false
                    }
                ],
                "outputs": [
                    "nodeset",
                    "nodeset_dyn",
                    "nodeset_tpu",
                    "partitions"
                ],
                "inject_module_id": null,
                "has_to_be_used": true
            }
        ],
        "container": [
            {
                "id": "artifact-registry",
                "name": "Artifact Registry",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "format",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "repo_mirror_url",
                        "required": false
                    },
                    {
                        "name": "repo_mode",
                        "required": false
                    },
                    {
                        "name": "repo_password",
                        "required": false
                    },
                    {
                        "name": "repo_public_repository",
                        "required": false
                    },
                    {
                        "name": "repo_username",
                        "required": false
                    },
                    {
                        "name": "repository_base",
                        "required": false
                    },
                    {
                        "name": "repository_path",
                        "required": false
                    },
                    {
                        "name": "use_upstream_credentials",
                        "required": false
                    },
                    {
                        "name": "user_managed_replication",
                        "required": false
                    }
                ],
                "outputs": [
                    "registry_url"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "database": [
            {
                "id": "bigquery-dataset",
                "name": "Bigquery Dataset",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "dataset_id",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    }
                ],
                "outputs": [
                    "dataset_id"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "bigquery-table",
                "name": "Bigquery Table",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "dataset_id",
                        "required": true
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "table_id",
                        "required": false
                    },
                    {
                        "name": "table_schema",
                        "required": true
                    }
                ],
                "outputs": [
                    "dataset_id",
                    "table_id",
                    "table_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "slurm-cloudsql-federation",
                "name": "Slurm Cloudsql Federation",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "authorized_networks",
                        "required": false
                    },
                    {
                        "name": "data_cache_enabled",
                        "required": false
                    },
                    {
                        "name": "database_flags",
                        "required": false
                    },
                    {
                        "name": "database_version",
                        "required": false
                    },
                    {
                        "name": "deletion_protection",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "disk_autoresize",
                        "required": false
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "edition",
                        "required": false
                    },
                    {
                        "name": "enable_backups",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "network_id",
                        "required": true
                    },
                    {
                        "name": "private_vpc_connection_peering",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "query_insights",
                        "required": false
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "sql_instance_name",
                        "required": true
                    },
                    {
                        "name": "sql_password",
                        "required": false
                    },
                    {
                        "name": "sql_username",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    },
                    {
                        "name": "tier",
                        "required": true
                    },
                    {
                        "name": "use_psc_connection",
                        "required": false
                    },
                    {
                        "name": "user_managed_replication",
                        "required": false
                    }
                ],
                "outputs": [
                    "cloudsql"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "file-system": [
            {
                "id": "DDN-EXAScaler",
                "name": "Ddn Exascaler",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "boot",
                        "required": false
                    },
                    {
                        "name": "cls",
                        "required": false
                    },
                    {
                        "name": "clt",
                        "required": false
                    },
                    {
                        "name": "fsname",
                        "required": false
                    },
                    {
                        "name": "image",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "local_mount",
                        "required": false
                    },
                    {
                        "name": "mds",
                        "required": false
                    },
                    {
                        "name": "mdt",
                        "required": false
                    },
                    {
                        "name": "mgs",
                        "required": false
                    },
                    {
                        "name": "mgt",
                        "required": false
                    },
                    {
                        "name": "mnt",
                        "required": false
                    },
                    {
                        "name": "network_properties",
                        "required": false
                    },
                    {
                        "name": "network_self_link",
                        "required": false
                    },
                    {
                        "name": "oss",
                        "required": false
                    },
                    {
                        "name": "ost",
                        "required": false
                    },
                    {
                        "name": "prefix",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "security",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "subnetwork_address",
                        "required": false
                    },
                    {
                        "name": "subnetwork_properties",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    },
                    {
                        "name": "waiter",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "client_config_script",
                    "http_console",
                    "install_ddn_lustre_client_runner",
                    "mount_command",
                    "mount_runner",
                    "network_storage",
                    "private_addresses",
                    "ssh_console"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "cloud-storage-bucket",
                "name": "Cloud Storage Bucket",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "autoclass",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "enable_hierarchical_namespace",
                        "required": false
                    },
                    {
                        "name": "enable_object_retention",
                        "required": false
                    },
                    {
                        "name": "enable_versioning",
                        "required": false
                    },
                    {
                        "name": "force_destroy",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "lifecycle_rules",
                        "required": false
                    },
                    {
                        "name": "local_mount",
                        "required": false
                    },
                    {
                        "name": "mount_options",
                        "required": false
                    },
                    {
                        "name": "name_prefix",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "public_access_prevention",
                        "required": false
                    },
                    {
                        "name": "random_suffix",
                        "required": false
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "retention_policy_period",
                        "required": false
                    },
                    {
                        "name": "soft_delete_retention_duration",
                        "required": false
                    },
                    {
                        "name": "storage_class",
                        "required": false
                    },
                    {
                        "name": "uniform_bucket_level_access",
                        "required": false
                    },
                    {
                        "name": "use_deployment_name_in_bucket_name",
                        "required": false
                    },
                    {
                        "name": "viewers",
                        "required": false
                    }
                ],
                "outputs": [
                    "client_install_runner",
                    "gcs_bucket_name",
                    "gcs_bucket_path",
                    "mount_runner",
                    "network_storage"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "nfs-server",
                "name": "Nfs Server",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "auto_delete_disk",
                        "required": false
                    },
                    {
                        "name": "boot_disk_size",
                        "required": false
                    },
                    {
                        "name": "boot_disk_type",
                        "required": false
                    },
                    {
                        "name": "create_boot_snapshot_before_destroy",
                        "required": false
                    },
                    {
                        "name": "create_snapshot_before_destroy",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "disk_size",
                        "required": false
                    },
                    {
                        "name": "image",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "local_mounts",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": false
                    },
                    {
                        "name": "network_self_link",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "provisioned_iops",
                        "required": false
                    },
                    {
                        "name": "provisioned_throughput",
                        "required": false
                    },
                    {
                        "name": "scopes",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    },
                    {
                        "name": "type",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "install_nfs_client",
                    "install_nfs_client_runner",
                    "mount_runner",
                    "network_storage"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "weka-client",
                "name": "Weka Client",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "local_mount",
                        "required": false
                    },
                    {
                        "name": "mount_options",
                        "required": false
                    },
                    {
                        "name": "remote_mount",
                        "required": true
                    },
                    {
                        "name": "server_ip",
                        "required": false
                    }
                ],
                "outputs": [
                    "client_install_runner",
                    "mount_runner"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "files": [
            {
                "id": "fsi-montecarlo-on-batch",
                "name": "Fsi Montecarlo On Batch",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "dataset_id",
                        "required": true
                    },
                    {
                        "name": "gcs_bucket_path",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "table_id",
                        "required": true
                    },
                    {
                        "name": "topic_id",
                        "required": true
                    },
                    {
                        "name": "topic_schema",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "management": [
            {
                "id": "dependencies-installer",
                "name": "Dependencies Installer",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "cluster_id",
                        "required": true
                    },
                    {
                        "name": "gke_cluster_exists",
                        "required": false
                    },
                    {
                        "name": "gpu_operator",
                        "required": false
                    },
                    {
                        "name": "jobset",
                        "required": false
                    },
                    {
                        "name": "kueue",
                        "required": false
                    },
                    {
                        "name": "nvidia_dra_driver",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "network": [
            {
                "id": "private-service-access",
                "name": "Private Service Access",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "address",
                        "required": false
                    },
                    {
                        "name": "deletion_policy",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "network_id",
                        "required": true
                    },
                    {
                        "name": "prefix_length",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "service_name",
                        "required": false
                    }
                ],
                "outputs": [
                    "cidr_range",
                    "connect_mode",
                    "private_vpc_connection_peering",
                    "reserved_ip_range"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "project": [
            {
                "id": "service-account",
                "name": "Service Account",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "billing_account_id",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "description",
                        "required": false
                    },
                    {
                        "name": "descriptions",
                        "required": false
                    },
                    {
                        "name": "display_name",
                        "required": false
                    },
                    {
                        "name": "generate_keys",
                        "required": false
                    },
                    {
                        "name": "grant_billing_role",
                        "required": false
                    },
                    {
                        "name": "grant_xpn_roles",
                        "required": false
                    },
                    {
                        "name": "name",
                        "required": true
                    },
                    {
                        "name": "names",
                        "required": false
                    },
                    {
                        "name": "org_id",
                        "required": false
                    },
                    {
                        "name": "prefix",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "project_roles",
                        "required": true
                    }
                ],
                "outputs": [
                    "key",
                    "service_account_email",
                    "service_account_iam_email"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "service-enablement",
                "name": "Service Enablement",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "disable_on_destroy",
                        "required": false
                    },
                    {
                        "name": "gcp_service_list",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "pubsub": [
            {
                "id": "bigquery-sub",
                "name": "Bigquery Sub",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "dataset_id",
                        "required": true
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "subscription_id",
                        "required": false
                    },
                    {
                        "name": "table_id",
                        "required": true
                    },
                    {
                        "name": "topic_id",
                        "required": true
                    }
                ],
                "outputs": [
                    "subscription_id"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "topic",
                "name": "Topic",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "schema_id",
                        "required": false
                    },
                    {
                        "name": "schema_json",
                        "required": false
                    },
                    {
                        "name": "topic_id",
                        "required": false
                    }
                ],
                "outputs": [
                    "topic_id",
                    "topic_schema"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "remote-desktop": [
            {
                "id": "chrome-remote-desktop",
                "name": "Chrome Remote Desktop",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "add_deployment_name_before_prefix",
                        "required": false
                    },
                    {
                        "name": "auto_delete_boot_disk",
                        "required": false
                    },
                    {
                        "name": "bandwidth_tier",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "enable_public_ips",
                        "required": false
                    },
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "install_nvidia_driver",
                        "required": true
                    },
                    {
                        "name": "instance_count",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "name_prefix",
                        "required": false
                    },
                    {
                        "name": "network_interfaces",
                        "required": false
                    },
                    {
                        "name": "network_self_link",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "on_host_maintenance",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "spot",
                        "required": false
                    },
                    {
                        "name": "startup_script",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    },
                    {
                        "name": "tags",
                        "required": false
                    },
                    {
                        "name": "threads_per_core",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [
                    "instance_name",
                    "startup_script"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "scheduler": [
            {
                "id": "htcondor-access-point",
                "name": "Htcondor Access Point",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "access_point_runner",
                        "required": false
                    },
                    {
                        "name": "access_point_service_account_email",
                        "required": true
                    },
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "autoscaler_runner",
                        "required": false
                    },
                    {
                        "name": "central_manager_ips",
                        "required": true
                    },
                    {
                        "name": "default_mig_id",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "distribution_policy_target_shape",
                        "required": false
                    },
                    {
                        "name": "enable_high_availability",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "enable_public_ips",
                        "required": false
                    },
                    {
                        "name": "enable_shielded_vm",
                        "required": false
                    },
                    {
                        "name": "htcondor_bucket_name",
                        "required": true
                    },
                    {
                        "name": "instance_image",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "mig_id",
                        "required": false
                    },
                    {
                        "name": "network_self_link",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "shielded_instance_config",
                        "required": false
                    },
                    {
                        "name": "spool_disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "spool_disk_type",
                        "required": false
                    },
                    {
                        "name": "spool_parent_dir",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    },
                    {
                        "name": "update_policy",
                        "required": false
                    },
                    {
                        "name": "zones",
                        "required": false
                    }
                ],
                "outputs": [
                    "access_point_ips",
                    "access_point_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "htcondor-central-manager",
                "name": "Htcondor Central Manager",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "central_manager_runner",
                        "required": false
                    },
                    {
                        "name": "central_manager_service_account_email",
                        "required": true
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "distribution_policy_target_shape",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "enable_shielded_vm",
                        "required": false
                    },
                    {
                        "name": "htcondor_bucket_name",
                        "required": true
                    },
                    {
                        "name": "instance_image",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "network_self_link",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "shielded_instance_config",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": false
                    },
                    {
                        "name": "update_policy",
                        "required": false
                    },
                    {
                        "name": "zones",
                        "required": false
                    }
                ],
                "outputs": [
                    "central_manager_ips",
                    "central_manager_name",
                    "list_instances_command"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "htcondor-pool-secrets",
                "name": "Htcondor Pool Secrets",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "access_point_service_account_email",
                        "required": true
                    },
                    {
                        "name": "central_manager_service_account_email",
                        "required": true
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "execute_point_service_account_email",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "pool_password",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "trust_domain",
                        "required": false
                    },
                    {
                        "name": "user_managed_replication",
                        "required": false
                    }
                ],
                "outputs": [
                    "access_point_runner",
                    "central_manager_runner",
                    "execute_point_runner",
                    "pool_password_secret_id",
                    "windows_startup_ps1"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "htcondor-service-accounts",
                "name": "Htcondor Service Accounts",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "access_point_roles",
                        "required": false
                    },
                    {
                        "name": "central_manager_roles",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "execute_point_roles",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    }
                ],
                "outputs": [
                    "access_point_service_account_email",
                    "central_manager_service_account_email",
                    "execute_point_service_account_email"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "htcondor-setup",
                "name": "Htcondor Setup",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "access_point_service_account_email",
                        "required": true
                    },
                    {
                        "name": "central_manager_service_account_email",
                        "required": true
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "execute_point_service_account_email",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": true
                    }
                ],
                "outputs": [
                    "htcondor_bucket_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "schedmd-slurm-gcp-v6-controller",
                "name": "Schedmd Slurm Gcp V6 Controller",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "additional_disks",
                        "required": false
                    },
                    {
                        "name": "advanced_machine_features",
                        "required": false
                    },
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "bandwidth_tier",
                        "required": false
                    },
                    {
                        "name": "bucket_dir",
                        "required": false
                    },
                    {
                        "name": "bucket_name",
                        "required": false
                    },
                    {
                        "name": "can_ip_forward",
                        "required": false
                    },
                    {
                        "name": "cgroup_conf_tpl",
                        "required": false
                    },
                    {
                        "name": "cloud_parameters",
                        "required": false
                    },
                    {
                        "name": "cloudsql",
                        "required": false
                    },
                    {
                        "name": "compute_startup_script",
                        "required": false
                    },
                    {
                        "name": "compute_startup_scripts_timeout",
                        "required": false
                    },
                    {
                        "name": "controller_network_attachment",
                        "required": false
                    },
                    {
                        "name": "controller_project_id",
                        "required": false
                    },
                    {
                        "name": "controller_startup_script",
                        "required": false
                    },
                    {
                        "name": "controller_startup_scripts_timeout",
                        "required": false
                    },
                    {
                        "name": "controller_state_disk",
                        "required": false
                    },
                    {
                        "name": "create_bucket",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "disable_controller_public_ips",
                        "required": false
                    },
                    {
                        "name": "disable_default_mounts",
                        "required": false
                    },
                    {
                        "name": "disable_smt",
                        "required": false
                    },
                    {
                        "name": "disk_auto_delete",
                        "required": false
                    },
                    {
                        "name": "disk_labels",
                        "required": false
                    },
                    {
                        "name": "disk_resource_manager_tags",
                        "required": false
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "enable_bigquery_load",
                        "required": false
                    },
                    {
                        "name": "enable_chs_gpu_health_check_epilog",
                        "required": false
                    },
                    {
                        "name": "enable_chs_gpu_health_check_prolog",
                        "required": false
                    },
                    {
                        "name": "enable_cleanup_compute",
                        "required": false
                    },
                    {
                        "name": "enable_confidential_vm",
                        "required": false
                    },
                    {
                        "name": "enable_controller_public_ips",
                        "required": false
                    },
                    {
                        "name": "enable_debug_logging",
                        "required": false
                    },
                    {
                        "name": "enable_default_mounts",
                        "required": false
                    },
                    {
                        "name": "enable_devel",
                        "required": false
                    },
                    {
                        "name": "enable_external_prolog_epilog",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "enable_shielded_vm",
                        "required": false
                    },
                    {
                        "name": "enable_slurm_auth",
                        "required": false
                    },
                    {
                        "name": "enable_slurm_gcp_plugins",
                        "required": false
                    },
                    {
                        "name": "enable_smt",
                        "required": false
                    },
                    {
                        "name": "endpoint_versions",
                        "required": false
                    },
                    {
                        "name": "epilog_scripts",
                        "required": false
                    },
                    {
                        "name": "extra_logging_flags",
                        "required": false
                    },
                    {
                        "name": "gcloud_path_override",
                        "required": false
                    },
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "instance_image_custom",
                        "required": false
                    },
                    {
                        "name": "instance_template",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "login_network_storage",
                        "required": false
                    },
                    {
                        "name": "login_nodes",
                        "required": false
                    },
                    {
                        "name": "login_startup_script",
                        "required": false
                    },
                    {
                        "name": "login_startup_scripts_timeout",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "min_cpu_platform",
                        "required": false
                    },
                    {
                        "name": "network_storage",
                        "required": false
                    },
                    {
                        "name": "nodeset",
                        "required": false
                    },
                    {
                        "name": "nodeset_dyn",
                        "required": false
                    },
                    {
                        "name": "nodeset_tpu",
                        "required": false
                    },
                    {
                        "name": "on_host_maintenance",
                        "required": false
                    },
                    {
                        "name": "partitions",
                        "required": false
                    },
                    {
                        "name": "preemptible",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "prolog_scripts",
                        "required": false
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "resource_manager_tags",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "shielded_instance_config",
                        "required": false
                    },
                    {
                        "name": "slurm_cluster_name",
                        "required": false
                    },
                    {
                        "name": "slurm_conf_template",
                        "required": false
                    },
                    {
                        "name": "slurm_conf_tpl",
                        "required": false
                    },
                    {
                        "name": "slurmdbd_conf_tpl",
                        "required": false
                    },
                    {
                        "name": "static_ips",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": true
                    },
                    {
                        "name": "tags",
                        "required": false
                    },
                    {
                        "name": "task_epilog_scripts",
                        "required": false
                    },
                    {
                        "name": "task_prolog_scripts",
                        "required": false
                    },
                    {
                        "name": "universe_domain",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": false
                    }
                ],
                "outputs": [
                    "instructions",
                    "slurm_bucket",
                    "slurm_bucket_dir",
                    "slurm_bucket_name",
                    "slurm_bucket_path",
                    "slurm_cluster_name",
                    "slurm_controller_instance",
                    "slurm_login_instances"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "schedmd-slurm-gcp-v6-login",
                "name": "Schedmd Slurm Gcp V6 Login",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "additional_disks",
                        "required": false
                    },
                    {
                        "name": "additional_networks",
                        "required": false
                    },
                    {
                        "name": "advanced_machine_features",
                        "required": false
                    },
                    {
                        "name": "allow_automatic_updates",
                        "required": false
                    },
                    {
                        "name": "bandwidth_tier",
                        "required": false
                    },
                    {
                        "name": "can_ip_forward",
                        "required": false
                    },
                    {
                        "name": "disable_login_public_ips",
                        "required": false
                    },
                    {
                        "name": "disable_smt",
                        "required": false
                    },
                    {
                        "name": "disk_auto_delete",
                        "required": false
                    },
                    {
                        "name": "disk_labels",
                        "required": false
                    },
                    {
                        "name": "disk_resource_manager_tags",
                        "required": false
                    },
                    {
                        "name": "disk_size_gb",
                        "required": false
                    },
                    {
                        "name": "disk_type",
                        "required": false
                    },
                    {
                        "name": "enable_confidential_vm",
                        "required": false
                    },
                    {
                        "name": "enable_login_public_ips",
                        "required": false
                    },
                    {
                        "name": "enable_oslogin",
                        "required": false
                    },
                    {
                        "name": "enable_shielded_vm",
                        "required": false
                    },
                    {
                        "name": "enable_smt",
                        "required": false
                    },
                    {
                        "name": "guest_accelerator",
                        "required": false
                    },
                    {
                        "name": "instance_image",
                        "required": false
                    },
                    {
                        "name": "instance_image_custom",
                        "required": false
                    },
                    {
                        "name": "instance_template",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": false
                    },
                    {
                        "name": "machine_type",
                        "required": false
                    },
                    {
                        "name": "metadata",
                        "required": false
                    },
                    {
                        "name": "min_cpu_platform",
                        "required": false
                    },
                    {
                        "name": "name_prefix",
                        "required": true
                    },
                    {
                        "name": "num_instances",
                        "required": false
                    },
                    {
                        "name": "on_host_maintenance",
                        "required": false
                    },
                    {
                        "name": "preemptible",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": false
                    },
                    {
                        "name": "resource_manager_tags",
                        "required": false
                    },
                    {
                        "name": "service_account",
                        "required": false
                    },
                    {
                        "name": "service_account_email",
                        "required": false
                    },
                    {
                        "name": "service_account_scopes",
                        "required": false
                    },
                    {
                        "name": "shielded_instance_config",
                        "required": false
                    },
                    {
                        "name": "static_ips",
                        "required": false
                    },
                    {
                        "name": "subnetwork_self_link",
                        "required": true
                    },
                    {
                        "name": "tags",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": false
                    }
                ],
                "outputs": [
                    "login_nodes"
                ],
                "inject_module_id": "name_prefix",
                "has_to_be_used": true
            },
            {
                "id": "slinky",
                "name": "Slinky",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "cert_manager_chart_version",
                        "required": false
                    },
                    {
                        "name": "cert_manager_values",
                        "required": false
                    },
                    {
                        "name": "cluster_id",
                        "required": true
                    },
                    {
                        "name": "install_kube_prometheus_stack",
                        "required": false
                    },
                    {
                        "name": "install_slurm_chart",
                        "required": false
                    },
                    {
                        "name": "install_slurm_operator_chart",
                        "required": false
                    },
                    {
                        "name": "node_pool_names",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "prometheus_chart_version",
                        "required": false
                    },
                    {
                        "name": "prometheus_values",
                        "required": false
                    },
                    {
                        "name": "slurm_chart_version",
                        "required": false
                    },
                    {
                        "name": "slurm_namespace",
                        "required": false
                    },
                    {
                        "name": "slurm_operator_chart_version",
                        "required": false
                    },
                    {
                        "name": "slurm_operator_namespace",
                        "required": false
                    },
                    {
                        "name": "slurm_operator_repository",
                        "required": false
                    },
                    {
                        "name": "slurm_operator_values",
                        "required": false
                    },
                    {
                        "name": "slurm_repository",
                        "required": false
                    },
                    {
                        "name": "slurm_values",
                        "required": false
                    }
                ],
                "outputs": [
                    "slurm_namespace",
                    "slurm_operator_namespace"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ],
        "scripts": [
            {
                "id": "htcondor-install",
                "name": "Htcondor Install",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "condor_version",
                        "required": false
                    },
                    {
                        "name": "enable_docker",
                        "required": false
                    },
                    {
                        "name": "http_proxy",
                        "required": false
                    },
                    {
                        "name": "python_windows_installer_url",
                        "required": false
                    }
                ],
                "outputs": [
                    "gcp_service_list",
                    "runners",
                    "windows_startup_ps1"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "ramble-execute",
                "name": "Ramble Execute",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "commands",
                        "required": false
                    },
                    {
                        "name": "data_files",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "gcs_bucket_path",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "log_file",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "ramble_profile_script_path",
                        "required": true
                    },
                    {
                        "name": "ramble_runner",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "spack_profile_script_path",
                        "required": false
                    },
                    {
                        "name": "system_user_name",
                        "required": true
                    }
                ],
                "outputs": [
                    "controller_startup_script",
                    "gcs_bucket_path",
                    "ramble_profile_script_path",
                    "ramble_runner",
                    "spack_profile_script_path",
                    "startup_script",
                    "system_user_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "ramble-setup",
                "name": "Ramble Setup",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "chmod_mode",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "install_dir",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "ramble_profile_script_path",
                        "required": false
                    },
                    {
                        "name": "ramble_ref",
                        "required": false
                    },
                    {
                        "name": "ramble_url",
                        "required": false
                    },
                    {
                        "name": "ramble_virtualenv_path",
                        "required": false
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "system_user_gid",
                        "required": false
                    },
                    {
                        "name": "system_user_name",
                        "required": false
                    },
                    {
                        "name": "system_user_uid",
                        "required": false
                    }
                ],
                "outputs": [
                    "controller_startup_script",
                    "gcs_bucket_path",
                    "ramble_path",
                    "ramble_profile_script_path",
                    "ramble_ref",
                    "ramble_runner",
                    "startup_script",
                    "system_user_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "spack-execute",
                "name": "Spack Execute",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "commands",
                        "required": false
                    },
                    {
                        "name": "data_files",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "gcs_bucket_path",
                        "required": true
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "log_file",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "spack_profile_script_path",
                        "required": true
                    },
                    {
                        "name": "spack_runner",
                        "required": true
                    },
                    {
                        "name": "system_user_name",
                        "required": true
                    }
                ],
                "outputs": [
                    "controller_startup_script",
                    "gcs_bucket_path",
                    "spack_profile_script_path",
                    "spack_runner",
                    "startup_script",
                    "system_user_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "spack-setup",
                "name": "Spack Setup",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "chmod_mode",
                        "required": false
                    },
                    {
                        "name": "configure_for_google",
                        "required": false
                    },
                    {
                        "name": "deployment_name",
                        "required": true
                    },
                    {
                        "name": "install_dir",
                        "required": false
                    },
                    {
                        "name": "labels",
                        "required": true
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "region",
                        "required": true
                    },
                    {
                        "name": "spack_profile_script_path",
                        "required": false
                    },
                    {
                        "name": "spack_ref",
                        "required": false
                    },
                    {
                        "name": "spack_url",
                        "required": false
                    },
                    {
                        "name": "spack_virtualenv_path",
                        "required": false
                    },
                    {
                        "name": "system_user_gid",
                        "required": false
                    },
                    {
                        "name": "system_user_name",
                        "required": false
                    },
                    {
                        "name": "system_user_uid",
                        "required": false
                    }
                ],
                "outputs": [
                    "controller_startup_script",
                    "gcs_bucket_path",
                    "spack_path",
                    "spack_profile_script_path",
                    "spack_runner",
                    "startup_script",
                    "system_user_name"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "wait-for-startup",
                "name": "Wait For Startup",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "gcloud_path_override",
                        "required": false
                    },
                    {
                        "name": "instance_name",
                        "required": false
                    },
                    {
                        "name": "instance_names",
                        "required": false
                    },
                    {
                        "name": "project_id",
                        "required": true
                    },
                    {
                        "name": "timeout",
                        "required": false
                    },
                    {
                        "name": "zone",
                        "required": true
                    }
                ],
                "outputs": [],
                "inject_module_id": null,
                "has_to_be_used": false
            },
            {
                "id": "windows-startup-script",
                "name": "Windows Startup Script",
                "icon": "\ud83d\udce6",
                "inputs": [
                    {
                        "name": "http_proxy",
                        "required": false
                    },
                    {
                        "name": "http_proxy_set_environment",
                        "required": false
                    },
                    {
                        "name": "install_nvidia_driver",
                        "required": false
                    },
                    {
                        "name": "install_nvidia_driver_args",
                        "required": false
                    },
                    {
                        "name": "install_nvidia_driver_script",
                        "required": false
                    },
                    {
                        "name": "no_proxy",
                        "required": false
                    }
                ],
                "outputs": [
                    "windows_startup_ps1"
                ],
                "inject_module_id": null,
                "has_to_be_used": false
            }
        ]
    }
};
