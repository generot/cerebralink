import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import random
import serial
import signal
import os

from cycler import cycler

BAUD_RATE = 9600

def linearspace(begin, end, step):
    return np.linspace(begin, end, int((end - begin) / step))

def app(n_samples, freq, max_amp, ser_port):
    FREQ = freq
    MAX_VAL_X = n_samples / 2
    MAX_VAL_Y = max_amp

    MINOR_ELEM_COLOR = "white"

    mpl.rcParams["axes.labelcolor"] = MINOR_ELEM_COLOR
    mpl.rcParams["axes.edgecolor"] = MINOR_ELEM_COLOR
    mpl.rcParams["xtick.color"] = MINOR_ELEM_COLOR
    mpl.rcParams["ytick.color"] = MINOR_ELEM_COLOR
    mpl.rcParams["axes.prop_cycle"] = cycler(color=['w'])
    mpl.rcParams["lines.linewidth"] = 1

    x_axis = linearspace(0.0, MAX_VAL_X, 1)
    y_axis = [0 for x in range(int(MAX_VAL_X))]

    plt.ion()

    fig, ax = plt.subplots()
    fig.set_facecolor("black")

    ln1, = ax.plot(x_axis, y_axis)

    ax.set_title("")
    ax.set_facecolor("black")

    ax.spines[["right", "top"]].set_visible(False)

    plt.xlabel("Frequency (Hz)")
    plt.ylabel("Amplitude (V)")

    ax.set_ylim(0, MAX_VAL_Y)

    #Setup serial comms
    comm = serial.Serial()

    comm.baudrate = BAUD_RATE
    comm.port = ser_port

    comm.open()

    comm.readline()

    while True:
        idx = 0
        while (ln := comm.readline()) != b'Done\n':
            as_str = ln.strip().decode()
            val = float(as_str)

            y_axis[idx] = val 
            idx += 1

        ln1.set_xdata(x_axis)
        ln1.set_ydata(y_axis)

        fig.canvas.draw_idle()
        fig.canvas.flush_events()

    return 0

app(128, 256, 30, "COM3")
