/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

locals {
  resource_prefix = var.name_prefix != null ? var.name_prefix : "${var.deployment_name}-ai-infra"

  user_startup_script_runners = var.startup_script == null ? [] : [
    {
      type        = "shell"
      content     = var.startup_script
      destination = "user_startup_script_ai_infra.sh"
    }
  ]

  ssh_args = join("", [
    "-e host_name_prefix=${local.resource_prefix}"
  ])

  configure_ssh = [
    {
      type        = "data"
      source      = "${path.module}/scripts/setup-ssh-keys.sh"
      destination = "/usr/local/ghpc/setup-ssh-keys.sh"
    },
    {
      type        = "data"
      source      = "${path.module}/scripts/setup-ssh-keys.yml"
      destination = "/usr/local/ghpc/setup-ssh-keys.yml"
    },
    {
      type        = "ansible-local"
      content     = file("${path.module}/scripts/configure-ssh.yml")
      destination = "configure-ssh.yml"
      args        = local.ssh_args
    }
  ]

  driver     = { install-nvidia-driver = var.install_nvidia_driver }
  logging    = var.enable_google_logging ? { google-logging-enable = 1 } : { google-logging-enable = 0 }
  monitoring = var.enable_google_monitoring ? { google-monitoring-enable = 1 } : { google-monitoring-enable = 0 }
  shutdown   = { shutdown-script = "/opt/deeplearning/bin/shutdown_script.sh" }
  metadata   = merge(local.driver, local.logging, local.monitoring, local.shutdown, var.metadata)
}

module "client_startup_script" {
  source = "github.com/GoogleCloudPlatform/hpc-toolkit//modules/scripts/startup-script?ref=e889ede"

  deployment_name = var.deployment_name
  project_id      = var.project_id
  region          = var.region
  labels          = var.labels

  runners = flatten([
    local.user_startup_script_runners, local.configure_ssh
  ])
}

module "instances" {
  source = "github.com/GoogleCloudPlatform/hpc-toolkit//modules/compute/vm-instance?ref=264e99c"

  instance_count = var.instance_count
  spot           = var.spot

  deployment_name = var.deployment_name
  name_prefix     = local.resource_prefix
  project_id      = var.project_id
  region          = var.region
  zone            = var.zone
  labels          = var.labels

  machine_type    = var.machine_type
  service_account = var.service_account
  metadata        = local.metadata
  startup_script  = module.client_startup_script.startup_script
  enable_oslogin  = var.enable_oslogin

  instance_image        = var.instance_image
  disk_size_gb          = var.disk_size_gb
  disk_type             = var.disk_type
  auto_delete_boot_disk = var.auto_delete_boot_disk
  local_ssd_count       = var.local_ssd_count
  local_ssd_interface   = var.local_ssd_interface

  disable_public_ips   = !var.enable_public_ips
  network_self_link    = var.network_self_link
  subnetwork_self_link = var.subnetwork_self_link
  network_interfaces   = var.network_interfaces
  bandwidth_tier       = var.bandwidth_tier
  placement_policy     = var.placement_policy
  tags                 = var.tags

  guest_accelerator   = var.guest_accelerator
  on_host_maintenance = var.on_host_maintenance
  threads_per_core    = var.threads_per_core

  network_storage = var.network_storage

}
