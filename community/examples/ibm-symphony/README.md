# IBM Spectrum Symphony on Google Cloud

This project provides a blueprint for deploying an IBM Spectrum Symphony cluster on Google Cloud Platform using the [Google Cloud Cluster Toolkit](https://github.com/GoogleCloudPlatform/cluster-toolkit). The blueprint automates the provisioning of the necessary infrastructure and the installation and configuration of Symphony.

## Overview

This blueprint deploys a Symphony cluster consisting of a master node and a set of compute nodes. Compute nodes can be deployed as static Virtual Machines (VMs) or managed by Managed Instance Groups (MIGs) for dynamic scaling. The deployment leverages various Google Cloud services, including:

*   **Google Compute Engine (GCE):** For creating virtual machines for the master and compute nodes.
*   **Google Cloud Storage:** For storing Symphony installation files.
*   **Packer:** For creating a custom machine image with Symphony pre-installed.
*   **Google Cloud Pub/Sub:** For monitoring GCE instance events to enable autoscaling.

## Directory Structure

*   `symphony.yaml`: The main Cluster Toolkit blueprint file that defines the architecture and configuration of the Symphony cluster.
*   `symphony_deployment.yaml`: A sample deployment file for overriding blueprint variables.

The resources and scripts are fetched automatically from the [scientific-computing-examples](https://github.com/GoogleCloudPlatform/scientific-computing-examples) repository during deployment.

## Prerequisites

1.  **Google Cloud SDK:** Make sure you have the `gcloud` CLI installed and configured.
2.  **Google Cloud Cluster Toolkit:** This project relies on the Cluster Toolkit. Follow the [installation instructions](https://cloud.google.com/cluster-toolkit/docs/setup/install-cluster-toolkit) to set it up.
3.  **IBM Spectrum Symphony Installers:** You need to download the IBM Spectrum Symphony installation files and place them in a local directory. You will also need to upload them to a Google Cloud Storage bucket.

## Deployment

1.  **Configure the Deployment file:** Open the `symphony_deployment.yaml` file and edit the variables under the `vars` section to match your environment. At a minimum, you need to set `project_id` and `sym_source_bucket`.

2.  **Deploy the Cluster:** Use the `gcluster` command to deploy the Symphony cluster. By default, it will deploy all groups (infrastructure, image, compute-mig, compute-vm, and master-node).

    ```bash
    gcluster deploy symphony.yaml -d symphony_deployment.yaml --auto-approve
    ```

3.  **Selective Deployment:** You can choose to deploy only specific components using the `--only` flag, or skip others using `--skip`.

    **To deploy only the VM-based compute nodes (skipping MIG):**
    ```bash
    gcluster deploy symphony.yaml -d symphony_deployment.yaml --skip compute-mig --auto-approve
    ```

    **To deploy only the MIG-based compute nodes (skipping static VMs):**
    ```bash
    gcluster deploy symphony.yaml -d symphony_deployment.yaml --skip compute-vm --auto-approve
    ```

4.  **Access the Cluster:** Once the deployment is complete, you can SSH into the master node to manage the Symphony cluster.

5.  **Connect to UI:** You can connect to the Symphony UI by forwarding port 8080 on your Master VM:
    ```bash
    gcloud compute ssh --zone "us-central1-a" "symphony1-master-0" --project "YOUR_PROJECT" --tunnel-through-iap -- -L 8080:localhost:8080
    ```

## Configuration

The `symphony.yaml` file is the source of truth for the cluster's configuration. You can modify this file to change machine types, disk sizes, and other parameters.

For more information, refer to the [official documentation](https://cloud.google.com/cluster-toolkit/docs).
