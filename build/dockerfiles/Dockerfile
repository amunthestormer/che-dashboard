# Copyright (c) 2021-2024 Red Hat, Inc.
# This program and the accompanying materials are made
# available under the terms of the Eclipse Public License 2.0
# which is available at https://www.eclipse.org/legal/epl-2.0/
#
# SPDX-License-Identifier: EPL-2.0
#
# Contributors:
#   Red Hat, Inc. - initial API and implementation

FROM docker.io/node:18.19.1-alpine3.19 as builder

# hadolint ignore=DL3018
RUN apk add --no-cache python3 py3-pip make g++ jq curl
RUN pip3 install yq --break-system-packages

# hadolint ignore=DL3059,SC1072
RUN if ! [ type "yarn" &> /dev/null ]; then \
        apk add yarn --no-cache; \
    fi

COPY package.json /dashboard/
COPY yarn.lock /dashboard/
COPY lerna.json /dashboard/
COPY tsconfig.json /dashboard/

ENV COMMON=packages/common
COPY ${COMMON}/package.json /dashboard/${COMMON}/

ENV FRONTEND=packages/dashboard-frontend
COPY ${FRONTEND}/package.json /dashboard/${FRONTEND}/

ENV BACKEND=packages/dashboard-backend
COPY ${BACKEND}/package.json /dashboard/${BACKEND}/

COPY .yarn/releases/yarn-*.cjs /dashboard/.yarn/releases/
COPY .yarnrc.yml /dashboard/
WORKDIR /dashboard
RUN yarn install --network-timeout 3600000
COPY packages/ /dashboard/packages
RUN yarn build

# Prepare air-gapped resources
COPY scripts/airgap.sh /dashboard/airgap.sh
RUN /dashboard/airgap.sh -i /dashboard/packages/devfile-registry/air-gap/index.json

FROM docker.io/node:18.19.1-alpine3.19

RUN apk --no-cache add curl

ENV FRONTEND_LIB=/dashboard/packages/dashboard-frontend/lib/public
ENV BACKEND_LIB=/dashboard/packages/dashboard-backend/lib
ENV DEVFILE_REGISTRY=/dashboard/packages/devfile-registry

COPY --from=builder ${BACKEND_LIB} /backend
COPY --from=builder ${FRONTEND_LIB} /public
COPY --from=builder ${DEVFILE_REGISTRY} /public/dashboard/devfile-registry

COPY build/dockerfiles/entrypoint.sh /entrypoint.sh

EXPOSE 80
EXPOSE 443

ENTRYPOINT [ "/entrypoint.sh" ]
CMD [ "sh" ]
