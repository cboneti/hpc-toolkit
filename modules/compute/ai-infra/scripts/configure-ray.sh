#!/bin/bash

ray_version=$1
ray_port=$2
gpus_per_vm=$3

# Run Ray under a new user/group.
addgroup ray
adduser --gecos --no-create-home --ingroup ray ray

runuser -u ray -- /opt/conda/bin/pip3 install \
	--no-cache-dir \
	"ray[default]==${ray_version}"

if [[ "${HOSTNAME##*-}" == "0" ]]; then
	echo "Starting Ray head node..."
	runuser -u ray -- /opt/conda/bin/ray start \
		--head \
		--port="${ray_port}" \
		--num-gpus="${gpus_per_vm}"
else
	echo "Starting Ray worker node..."
	runuser -u ray -- /opt/conda/bin/ray start \
		--address="${HOSTNAME%-*}-0:${ray_port}" \
		--num-gpus="${gpus_per_vm}"
fi

# TODO: The better option is to add users to a Google group, which can then be
# added to the `ray` Posix group. Then, chmod g+w /tmp/ray to give
# group-restricted access to the Ray cluster.
chmod -R a+w /tmp/ray
