# NLP Setup
This section will guide on how to setup your enviromnet to run the NLP tasks

## 1. Enviroments Setup
### &nbsp;&nbsp;&nbsp;&nbsp; 1. Install Miniconda
https://docs.anaconda.com/free/miniconda/miniconda-install/
  
  Now open miniconda terminal:

### &nbsp;&nbsp;&nbsp;&nbsp; 2. Tensorflow Environment Setup
```
conda create -n tensorflow python=3.10
conda activate tensorflow
pip install "tensorflow==2.10" notebook
conda install -c conda-forge cudatoolkit=11.2 cudnn=8.1.0
python
import tensorflow as tf
len(tf.config.list_physical_devices('GPU')) > 0 #True
quit()
```
&nbsp;
### &nbsp;&nbsp;&nbsp;&nbsp; 3. Pytorch Environment Setup
```
conda create -n pytorch python=3.9
conda activate pytorch
conda install cudatoolkit -c anaconda -y
conda install pytorch-cuda=12.1 -c pytorch -c nvidia -y
conda install pytorch torchvision torchaudio -c pytorch -c nvidia -y
pip install notebook
python
import torch
torch.cuda.is_available() #True
quit()
```
  &nbsp;
## 2. Project Setup
### &nbsp;&nbsp;&nbsp;&nbsp; 1. Start Miniconda
Open miniconda and run:
```
conda init powershell
```
Then, on your powershell:
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser 
  
conda activate pytorch
```
This part is a little tricky but some online resources teach how to get around if you have an issue. 
   
From now on, you should be in the NLP directory with your pytorch environmen setup.
&nbsp;
### &nbsp;&nbsp;&nbsp;&nbsp; 2. Flask
Flask is a microframework to run our NLP application. With flask, models are loaded at startup, and our server backend can successfully send requests.
```
pip install Flask
$env:FLASK_APP = "src/app.py"
set FLASK_APP=src/app.py
```
  
To run the flask environment:
```
python -m flask run --host=0.0.0.0 --port=5000
flask run --host=0.0.0.0 --port=5000
```
To run Tests:
```
python -m unittest tests.tests
```
To run a specific test Class/method
```
python -m unittest tests.tests.TestClass
python -m unittest tests.tests.TestClass.test_method
```
&nbsp;
### &nbsp;&nbsp;&nbsp;&nbsp; 3. Install libraries
During development phase, I am constantly trying new libraries and testing new models, so I might forget to update this document.
```
pip install newspaper3k
pip install transformers
pip install summarizer
pip install bs4
pip install dateutil
pip install trafilatura
```
