FROM alpine:latest


ENV SHELL /bin/bash

ENV NON_PRIVILEGED_USER="user"
ENV NON_PRIVILEGED_USER_PASSWORD="pass"
ENV NON_PRIVILEGED_USER_GROUP="app"
ENV CONDA_DIR /home/$NON_PRIVILEGED_USER/anaconda

#################
# INSTALL CONDA #
#################
# ENV CONDA_DIR="/opt/conda"
ENV PATH="$CONDA_DIR/bin:$PATH"

# Install conda
RUN CONDA_VERSION="4.5.12" && \
    CONDA_MD5_CHECKSUM="866ae9dff53ad0874e1d1a60b1ad1ef8" && \
    \
    apk add --no-cache --virtual=.build-dependencies wget ca-certificates bash && \
    \
    mkdir -p "$CONDA_DIR" && \
    wget "http://repo.continuum.io/miniconda/Miniconda3-${CONDA_VERSION}-Linux-x86_64.sh" -O miniconda.sh && \
    echo "$CONDA_MD5_CHECKSUM  miniconda.sh" | md5sum -c && \
    bash miniconda.sh -f -b -p "$CONDA_DIR" && \
    echo "export PATH=$CONDA_DIR/bin:\$PATH" > /etc/profile.d/conda.sh && \
    rm miniconda.sh && \
    \
    conda update --all --yes && \
    conda config --set auto_update_conda False && \
    rm -r "$CONDA_DIR/pkgs/" && \
    \
    apk del --purge .build-dependencies && \
    \
    mkdir -p "$CONDA_DIR/locks" && \
    chmod 777 "$CONDA_DIR/locks"

########################
# USE LOCAL JUPYTERLAB #
########################

# first remove only jupyterlab, not its dependencies which conda already installed
RUN conda remove jupyterlab --yes --quiet
# then use github version of jupyterlab
RUN wget https://github.com/jupyterlab/jupyterlab/archive/v${JUPYTER_LAB_VERSION}.tar.gz -O jupyterlab.tar.gz

# check sha256 sum and
# unpack
RUN echo "89c3a656438b743d1bfd5731091fd3e916fc711ab55178797ff9aba468a087b2 jupyterlab.tar.gz" | sha256sum -c -\
 && tar -xvzf jupyterlab.tar.gz


WORKDIR jupyterlab-${JUPYTER_LAB_VERSION}
# install npm dependencies
RUN npm install
# build package
RUN npm run build:packages
# build the published web assets (required!)
WORKDIR /home/dev/jupyter_lab/jupyterlab
RUN npm run publish
WORKDIR /home/dev/jupyterlab
# remove npm packages which are now not needed anymore to install with pip
# this prevents pip getting stuck with too many files to process/ignore
RUN rm -rf packages
# try to install the package with pip
RUN pip install --verbose --verbose --verbose .
RUN jupyter lab build

#########################
# JUPYTERLAB EXTENSIONS #
#########################
RUN jupyter serverextension enable --py jupyterlab --sys-prefix

